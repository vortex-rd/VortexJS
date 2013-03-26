var NodoVistaDeBiblioteca = function(cfg){
    this._id_biblioteca = cfg.id_biblioteca;
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
        this._portal = new NodoPortalBidi("vista biblioteca")
        this._router.conectarBidireccionalmenteCon(this._portal);
        
        this._librosEncontrados = [];
        
        this._portal.pedirMensajes(new FiltroAND([new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.libro"),  
                                                 new FiltroXClaveValor("idBiblioteca", this._id_biblioteca)]),
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
                                    titulo: un_libro.titulo(),
                                    idBiblioteca: this._id_biblioteca});
    },
    enviarComandoDeBuscarLibros : function() {
        this._portal.enviarMensaje({tipoDeMensaje: "vortexComm.biblioteca.pedidoDeLibros",
                                    idBiblioteca: this._id_biblioteca});
    },
    onLibroEncontrado : function (mensaje) {
        var libro = new Libro(mensaje);
        if(this.librosEncontrados().Any(function(l){return ComparadorDeObjetos.comparar(l,libro)})) return;
        this._librosEncontrados.push(libro);    
        
        var vista_libro = new VistaDeLibroEnBuscador(libro, this._plantilla_libro.clone());
        vista_libro.dibujarEn(this._panel_libros);      
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
        console.log("Nodo vista de biblioteca recibe mensaje:", un_mensaje)
        this._router.recibirMensaje(un_mensaje);
    } 
}