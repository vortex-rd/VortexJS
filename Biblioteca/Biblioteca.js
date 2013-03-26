var NodoBiblioteca = function(id){
    this._id = id;
    this.start();
}
NodoBiblioteca.prototype = {
    start : function(){
        this._router = new NodoRouter("biblioteca");
        this._portal = new NodoPortalBidi("biblioteca");
        this._router.conectarBidireccionalmenteCon(this._portal);
        
        this._libros = [];
        
        this._portal.pedirMensajes(new FiltroAND([new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.agregarLibro"),  
                                                 new FiltroXClaveValor("idBiblioteca", this._id)]),
                       this.onMensajeAgregarLibroRecibido.bind(this));
    },
    libros : function(un_libro) {
        return Enumerable.From(this._libros);
    },
    onMensajeAgregarLibroRecibido: function(un_mensaje) {
        this.agregarLibro(new NodoLibro(un_mensaje));
    },
    agregarLibro : function(un_nodo_libro) {
        this._libros.push(un_nodo_libro);
        this._router.conectarBidireccionalmenteCon(un_nodo_libro);
        un_nodo_libro.enviarLibro();        
    },
    conectarCon: function(un_nodo){
        this._router.conectarCon(un_nodo);   
    },
    recibirMensaje: function(un_mensaje){
        console.log("Nodo biblioteca recibe mensaje:", un_mensaje)
        this._router.recibirMensaje(un_mensaje);
    }   
}

//
//var NodoBiblioteca = function(un_router){
//    this._biblioteca = new Biblioteca();
//    this._controlador_de_biblioteca = new ControladorDeBiblioteca(this._biblioteca, un_router);
//}
//NodoBiblioteca.prototype = {
//    
//}
//    
//var Biblioteca = function(){    
//    this._libros = [];
//    this._controlador = {libroAgregado : function(){}};
//}
//Biblioteca.prototype ={
//    libros : function(un_libro) {
//        return Enumerable.From(this._libros);
//    },
//    agregarLibro : function(un_libro) {
//        this._libros.push(un_libro);
//        this._controlador.libroAgregado(un_libro);
//    },
//    buscarLibrosPorAutor : function(autor) {        
//        return Enumerable.From(this._libros).Where(function(l){return l._autor == autor});
//    },
//    controlador : function(un_controlador) {
//        this._controlador = un_controlador;
//    },
//    vista : function(una_vista) {
//        this._vista = una_vista;
//    }
//};
//
//
//var ControladorDeBiblioteca = function(una_biblioteca, un_router){
//    this._biblioteca = una_biblioteca;
//    this._router = un_router;  
//    this.start();
//}
//    
//ControladorDeBiblioteca.prototype = {
//    start : function(){
//        this._portal = new NodoPortalBidi("biblioteca");
//        this._router.conectarCon(this._portal);
//        this._portal.conectarCon(this._router);  
//        this._portal.pedirMensajes(new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.agregarLibro"),  
//                       this.onMensajeAgregarLibroRecibido.bind(this));
//        this._biblioteca.controlador(this);
//    },
//    libroAgregado : function(un_libro) {
//        this.enviarLibro(un_libro);
//        FabricaDeLibros.conectarLibroALaRed(this._router, un_libro);
//    },
//    onMensajeAgregarLibroRecibido: function(un_mensaje) {
//        this._biblioteca.agregarLibro(new Libro(un_mensaje));
//    },
//    enviarLibro : function(un_libro) {
//        this._portal.enviarMensaje({tipoDeMensaje: "vortexComm.biblioteca.libro", 
//                                    autor:un_libro.autor(),
//                                    titulo: un_libro.titulo()});
//    }
//};