var NodoBuscadorDeLibros = function(cfg){
    this._plantilla_libro = cfg.plantilla_libro;
    this._ui = cfg.UI;
    this.start();
};

NodoBuscadorDeLibros.prototype = {
    start: function(){
        this._router = new NodoRouter("buscador");
        this._portal = new NodoPortalBidiMonoFiltro("buscador")
        this._router.conectarBidireccionalmenteCon(this._portal);
        
        this._librosEncontrados = [];
        this._input_busqueda = this._ui.find('#input_de_busqueda_del_buscador_de_libros');
        this._panel_libros_encontrados = this._ui.find('#lista_de_libros_encontrados_del_buscador_de_libros');
        
        this._input_busqueda.change(this.nuevoCriterioDeBusqueda.bind(this));
    },
    nuevoCriterioDeBusqueda : function(){
        this.pedirLibrosPorAutor(this._input_busqueda.val());
    },
    pedirLibrosPorAutor : function(autor) {        
        this.limpiarLibrosEncontrados();
        this._portal.pedirMensajes(new FiltroAND([new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.libro"),
                                                    new FiltroXClaveValor("autor", autor)]),
                              this.onLibroEncontrado.bind(this));  
        this._portal.enviarMensaje({tipoDeMensaje: "vortexComm.biblioteca.busquedaDeLibrosPorAutor", autor:autor});
    },
    limpiarLibrosEncontrados: function(){
        this._librosEncontrados = [];
        this._panel_libros_encontrados.empty();
    },
    onLibroEncontrado : function (mensaje) {
        var un_libro = new Libro(mensaje);                
        if(this.librosEncontrados().Any(function(l){return ComparadorDeObjetos.comparar(l,un_libro)})) return;
        this._librosEncontrados.push(un_libro);    
        var vista_libro = new VistaDeLibroEnBuscador(un_libro, this._plantilla_libro.clone());
        vista_libro.dibujarEn(this._panel_libros_encontrados);        
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
        console.log("Nodo buscador recibe mensaje:", un_mensaje)
        this._router.recibirMensaje(un_mensaje);
    }   
};

var VistaDeLibroEnBuscador = function(libro, UI){
    this._ui = UI;
  
    this._label_autor = UI.find('#autor_de_libro_encontrado');
    this._label_titulo = UI.find('#titulo_de_libro_encontrado');
    
    this._label_autor.text(libro.autor());
    this._label_titulo.text(libro.titulo());
}

VistaDeLibroEnBuscador.prototype = {
    dibujarEn: function(panel){
        panel.append(this._ui);
    }
};


//
//
//
//
//
//var FabricaDeBuscadoresDeLibros = {
//    crearBuscador : function(){
//        return new BuscadorDeLibros();
//    },
//    crearBuscadorConectadoALaRed : function(nodo){
//        var portal_buscador = new NodoPortalBidiMonoFiltro("buscador");
//        nodo.conectarCon(portal_buscador);
//        portal_buscador.conectarCon(nodo); 
//        
//        un_buscador = new BuscadorDeLibros();
//        un_controlador_de_buscador = new ControladorDeBuscadorDeLibros(un_buscador, portal_buscador);
//        
//        return un_buscador;
//    }
//}
//    
//var BuscadorDeLibros = function(){
//    this._librosEncontrados = [];
//    this._controlador = {pedirLibrosPorAutor : function(autor){}};
//    this._vista = {cambiaronLosLibrosEncontradosEnElBuscador : function(libro){}};
//}
//
//BuscadorDeLibros.prototype = {
//    librosEncontrados : function() {
//        return Enumerable.From(this._librosEncontrados);
//    },
//    pedirLibrosPorAutor : function(autor) {
//        this._controlador.pedirLibrosPorAutor(autor);
//        this._librosEncontrados = [];
//    },
//    nuevoLibroEncontrado : function(un_libro) {
//        if(this.librosEncontrados().Any(function(l){return ComparadorDeObjetos.comparar(l,un_libro)})) return;
//        this._librosEncontrados.push(un_libro);    
//        this._vista.cambiaronLosLibrosEncontradosEnElBuscador();
//    },
//    controlador : function(un_controlador) {
//        this._controlador = un_controlador;
//    },
//    vista : function(una_vista) {
//        this._vista = una_vista;
//    }
//};
//
//var VistaDeBuscadorDeLibros = function(buscador, UI, plantilla_libro){
//    this._buscador = buscador;
//    this._ui = UI;
//    this._plantilla_libro = plantilla_libro;
//    
//    this._input_busqueda = UI.find('#input_de_busqueda_del_buscador_de_libros');
//    this._panel_libros_encontrados = UI.find('#lista_de_libros_encontrados_del_buscador_de_libros');
//    
//    var self = this;
//    this._input_busqueda.change(function(){
//        self.nuevoCriterioDeBusqueda();
//    });
//        
//    this._buscador.vista(this); 
//}
//
//VistaDeBuscadorDeLibros.prototype = {
//    cambiaronLosLibrosEncontradosEnElBuscador : function() {  
//        var self = this;
//        this._panel_libros_encontrados.empty();
//        this._buscador.librosEncontrados().ForEach(function(libro){
//            var vista_libro = new VistaDeLibroEnBuscador(libro, self._plantilla_libro.clone());
//            vista_libro.dibujarEn(self._panel_libros_encontrados);
//        });        
//    },
//    dibujarEn: function(panel){
//        panel.append(this._ui);
//    },
//    nuevoCriterioDeBusqueda : function(){
//        this._panel_libros_encontrados.empty();
//        this._buscador.pedirLibrosPorAutor(this._input_busqueda.val());
//    }
//};
//
//
//
//var ControladorDeBuscadorDeLibros = function(un_buscador, un_portal){
//    this._buscador = un_buscador;
//    this._portal = un_portal;
//    
//    this.inicializar();
//}
//
//ControladorDeBuscadorDeLibros.prototype = {
//    inicializar : function() {        
//        this._buscador.controlador(this);
//    },
//    pedirLibrosPorAutor : function(autor) {
//        
//        var self = this;
//        this._portal.pedirMensajes(new FiltroAND([new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.libro"),
//                                                    new FiltroXClaveValor("autor", autor)]),
//                              function(mensaje){self.onLibroEncontrado(mensaje);});  
//        this._portal.enviarMensaje({tipoDeMensaje: "vortexComm.biblioteca.busquedaDeLibrosPorAutor", autor:autor});
//    },
//    onLibroEncontrado : function (mensaje) {
//        var libro = new Libro({autor:mensaje.autor, titulo:mensaje.titulo});                
//        this._buscador.nuevoLibroEncontrado(libro);
//    }
//};  