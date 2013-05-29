var NodoInventario = function (cfg) {
    this._canal_control = cfg.canalControl;
    this._canal_busquedas = cfg.canalBusquedas;
    this.start();
};
NodoInventario.prototype = {
    start : function(){
        this._router = new NodoRouter("inventario");
        this._portal = new NodoPortalConCanal("inventario", this._canal_control);
        this._router.conectarBidireccionalmenteCon(this._portal);
        
        this._cosas = [];
        
        this._portal.pedirMensajes(new FiltroXClaveValor("tipoDeMensaje", "vortexComm.inventario.agregarCosa"),
                       this.onMensajeAgregarCosaRecibido.bind(this));
    },
    cosas : function() {
        return Enumerable.From(this._cosas);
    },
    onMensajeAgregarCosaRecibido: function(un_mensaje) {
        un_mensaje.id = this._cosas.length;
        var cfgCosa = {};
        cfgCosa.titulo = un_mensaje.titulo;
        cfgCosa.autor = un_mensaje.autor;
        cfgCosa.canalControl = this._canal_control.getSubCanal("cosa" + this._cosas.length, 
                                               new FiltroXClaveValor("cosa", this._cosas.length) , 
                                               new TrafoXClaveValor("cosa", this._cosas.length));
        
        cfgCosa.canalBusquedas = this._canal_busquedas;
        var cosa = new NodoCosa(cfgCosa);        
        this.agregarCosa(cosa);
    },
    agregarCosa : function(un_nodo_cosa) {
        this._cosas.push(un_nodo_cosa);
        this._router.conectarBidireccionalmenteCon(un_nodo_cosa);
        un_nodo_cosa.enviarCosa();        
    },
    conectarCon: function(un_nodo){
        this._router.conectarCon(un_nodo);   
    },
    recibirMensaje: function(un_mensaje){
        this._router.recibirMensaje(un_mensaje);
    }   
}