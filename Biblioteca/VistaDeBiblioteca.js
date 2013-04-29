var NodoVistaDeBiblioteca = function(cfg){
    this._canal_control = cfg.canalControl;
    this._ui = cfg.UI;
    this._input_autor_en_alta = this._ui.find('#input_nombre_autor_del_alta_de_libros');
    this._input_titulo_en_alta = this._ui.find('#input_titulo_del_alta_de_libros');
    this._boton_alta_de_libro = this._ui.find('#boton_agregar_del_alta_de_libros');
    this._boton_refrescar = this._ui.find('#boton_refrescar_del_alta_de_libros');
    this._panel_libros = this._ui.find('#panel_libros_en_vista_de_libros');   
    
    this._plantilla_libro = cfg.plantilla_libro;
    
    this.start();
}

NodoVistaDeBiblioteca.prototype = {
    start: function(){
        this._router = new NodoRouter("vista biblioteca");
        this._portal = new NodoPortalConCanal("vista biblioteca", this._canal_control);
        this._router.conectarBidireccionalmenteCon(this._portal);
        
        this._librosEncontrados = [];
        
        this._portal.pedirMensajes(new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.libro"),
                          this.onLibroEncontrado.bind(this));  
        var self = this;
        this._boton_alta_de_libro.click(function(){
            self.enviarComandoDeAgregarLibro(
                new Libro({
                    titulo:self._input_titulo_en_alta.val(), 
                    autor:self._input_autor_en_alta.val()
                })
            );
        });
        this._boton_refrescar.click(this.enviarComandoDeBuscarLibros.bind(this));
    },
    enviarComandoDeAgregarLibro : function(un_libro) {
        this._portal.enviarMensaje({tipoDeMensaje: "vortexComm.biblioteca.agregarLibro", 
                                    autor:un_libro.autor(),
                                    titulo: un_libro.titulo()});
    },
    enviarComandoDeBuscarLibros : function() {
        this._portal.enviarMensaje({tipoDeMensaje: "vortexComm.biblioteca.busquedaDeLibros"});
    },
    onLibroEncontrado : function (mensaje) {
        var canal_libro = new Canal();
        canal_libro.desSerializar(mensaje.canalLibro);
        var vLibro = new NodoVistaDeEdicionDeLibro({UI: this._plantilla_libro.clone(),
                                                  autor: mensaje.autor,
                                                  titulo: mensaje.titulo,
                                                  canalLibro: canal_libro});
        
        if(this.librosEncontrados().Any(function(vl){return vLibro.equals(vl);})) return;
        this._librosEncontrados.push(vLibro);    
        
        this._router.conectarBidireccionalmenteCon(vLibro);
        vLibro.dibujarEn(this._panel_libros);      
    },
    librosEncontrados : function() {
        return Enumerable.From(this._librosEncontrados);
    },  
    dibujarEn: function(panel){
        panel.append(this._ui);
    },
    conectarCon: function(un_nodo){
        this._router.conectarCon(un_nodo);   
    },
    recibirMensaje: function(un_mensaje){
        this._router.recibirMensaje(un_mensaje);
    } 
}


var NodoVistaDeEdicionDeLibro = function(cfg){
    this._ui = cfg.UI;
    this._autor = cfg.autor;
    this._titulo = cfg.titulo;
    this._canal_libro = cfg.canalLibro;
    
    this.start();
}

NodoVistaDeEdicionDeLibro.prototype = {
    start: function(){
        this._portal = new NodoPortalConCanal("vista edicion libro", this._canal_libro);
        this._input_autor = this._ui.find('#autor_de_libro_en_edicion');
        this._input_titulo = this._ui.find('#titulo_de_libro_en_edicion');
        
        this._input_autor.change(this.onCambiosEnInput.bind(this));
        this._input_titulo.change(this.onCambiosEnInput.bind(this));
        
        this._input_autor.val(this._autor);
        this._input_titulo.val(this._titulo);
        
        this._portal.pedirMensajes(new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.libroActualizado"),
                                   this.actualizar.bind(this));
    },  
    onCambiosEnInput: function(){
        this._autor = this._input_autor.val();
        this._titulo = this._input_titulo.val();
        this._portal.enviarMensaje({
            tipoDeMensaje: "vortexComm.biblioteca.edicionDelibro",
            autor:this._autor,
            titulo:this._titulo
        });
    },
    actualizar: function(libro){
        this._input_autor.val(libro.autor);
        this._input_titulo.val(libro.titulo);
        this._autor = libro.autorr;
        this._titulo = libro.titulo;
    },    
    dibujarEn: function(panel){
        panel.append(this._ui);
    },
    conectarCon: function(un_nodo){
        this._portal.conectarCon(un_nodo);   
    },
    recibirMensaje: function(un_mensaje){
        this._portal.recibirMensaje(un_mensaje);
    },
    equals: function(obj){
        if(!(obj instanceof NodoVistaDeEdicionDeLibro)) return false;
        return this._canal_libro.equals(obj._canal_libro);
    }
};