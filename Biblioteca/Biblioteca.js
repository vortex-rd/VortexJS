var NodoBiblioteca = function (cfg) {
    this._canal_control = cfg.canalControl;
    this._canal_busquedas = cfg.canalBusquedas;
    this.start();
};
NodoBiblioteca.prototype = {
    start : function(){
        this._router = new NodoRouter("biblioteca");
        this._portal = new NodoPortalConCanal("biblioteca", this._canal_control);
        this._router.conectarBidireccionalmenteCon(this._portal);
        
        this._libros = [];
        
        this._portal.pedirMensajes(new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.agregarLibro"),
                       this.onMensajeAgregarLibroRecibido.bind(this));
    },
    libros : function(un_libro) {
        return Enumerable.From(this._libros);
    },
    onMensajeAgregarLibroRecibido: function(un_mensaje) {
        un_mensaje.id = this._libros.length;
        var cfgLibro = {};
        cfgLibro.titulo = un_mensaje.titulo;
        cfgLibro.autor = un_mensaje.autor;
        cfgLibro.canalControl = this._canal_control.getSubCanal("libro" + this._libros.length, 
                                               new FiltroXClaveValor("libro", this._libros.length) , 
                                               new TrafoXClaveValor("libro", this._libros.length));
        
        cfgLibro.canalBusquedas = this._canal_busquedas;
        var libro = new NodoLibro(cfgLibro);        
        this.agregarLibro(libro);
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
        this._router.recibirMensaje(un_mensaje);
    }   
}