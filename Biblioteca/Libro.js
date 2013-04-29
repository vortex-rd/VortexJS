var NodoLibro = function(cfg){
    this._titulo = cfg.titulo || "";
    this._autor = cfg.autor || "";
    this._canal_control = cfg.canalControl;
    this._canal_busquedas = cfg.canalBusquedas;
    this.start();
}
NodoLibro.prototype = {
    start: function(){
        this._router = new NodoRouter("libro");
        this._portal_control = new NodoPortalConCanal("libro", this._canal_control);
        this._portal_control.pedirMensajes(new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.edicionDelibro"),
                                   this.actualizar.bind(this));
        this._router.conectarBidireccionalmenteCon(this._portal_control);
        
        this._portal_busquedas = new NodoPortalBidiMonoFiltroConCanal("libro", this._canal_busquedas);
        this.hacerPedidoDeBusquedas();
        this._router.conectarBidireccionalmenteCon(this._portal_busquedas);
    },
    actualizar: function(libro){
        this._autor = libro.autor;
        this._titulo = libro.titulo;
        
        this.hacerPedidoDeBusquedas();
        this.libroActualizado();
    },
    libroActualizado: function(){
         var mensaje = {tipoDeMensaje: "vortexComm.biblioteca.libroActualizado", 
                                    autor: this._autor,
                                    titulo: this._titulo,
                                    canalLibro: this._canal_control.serializar()};
        this._portal_control.enviarMensaje(mensaje);
        var otro_mensaje = {tipoDeMensaje: "vortexComm.biblioteca.libroActualizado", 
                                    autor: this._autor,
                                    titulo: this._titulo,
                                    canalLibro: this._canal_control.serializar()};
        this._portal_busquedas.enviarMensaje(otro_mensaje);  
    },
    hacerPedidoDeBusquedas: function(){
        var self = this;
        this._portal_busquedas.pedirMensajes(new FiltroAND([    new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.busquedaDeLibros"),
                                                                new FiltroXClaveValor("autor", this._autor)
                                                            ]),
                                             function(){
                                                 self.enviarLibro(self._portal_busquedas);
                                             });    
        this._portal_control.pedirMensajes(new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.busquedaDeLibros"),
                                             function(){
                                                 self.enviarLibro(self._portal_control);
                                             });    
    },
    conectarCon: function(un_nodo){
        this._router.conectarCon(un_nodo);   
    },
    recibirMensaje: function(un_mensaje){
        this._router.recibirMensaje(un_mensaje);
    },
    enviarLibro : function(portal) {
        var mensaje = {tipoDeMensaje: "vortexComm.biblioteca.libro", 
                                    autor: this._autor,
                                    titulo: this._titulo,
                                    canalLibro: this._canal_control.serializar()};
        if( portal !== undefined) {portal.enviarMensaje(mensaje); 
                                    return;}
        this._portal_control.enviarMensaje(mensaje);
        var otro_mensaje = {tipoDeMensaje: "vortexComm.biblioteca.libro", 
                                    autor: this._autor,
                                    titulo: this._titulo,
                                    canalLibro: this._canal_control.serializar()};
        this._portal_busquedas.enviarMensaje(otro_mensaje);  
    }
};

var Libro = function(cfg){
    this._titulo = cfg.titulo || "";
    this._autor = cfg.autor || "";
}

Libro.prototype = {
    titulo : function() {
        return this._titulo;
    },
    autor : function() {
        return this._autor;
    }
};