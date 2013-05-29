var NodoCosa = function(cfg){
    this._nombre = cfg.nombre || "";
    this._descripcion = cfg.descripcion || "";
    this._canal_control = cfg.canalControl;
    this._canal_busquedas = cfg.canalBusquedas;
    this.start();
}
NodoCosa.prototype = {
    start: function(){
        this._router = new NodoRouter("cosa");
        this._portal_control = new NodoPortalConCanal("cosa", this._canal_control);
        this._portal_control.pedirMensajes(new FiltroXClaveValor("tipoDeMensaje", "vortexComm.inventario.edicionDeCosa"),
                                   this.actualizar.bind(this));
        this._router.conectarBidireccionalmenteCon(this._portal_control);
        
        this._portal_busquedas = new NodoPortalBidiMonoFiltroConCanal("cosa", this._canal_busquedas);
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
         var mensaje = {tipoDeMensaje: "vortexComm.inventario.cosaActualizada", 
                                    nombre: this._nombre,
                                    descripcion: this._descripcion,
                                    canalCosa: this._canal_control.serializar()};
        this._portal_control.enviarMensaje(mensaje);
        var otro_mensaje = {tipoDeMensaje: "vortexComm.inventario.cosaActualizada", 
                                    autor: this._nombre,
                                    titulo: this._descripcion,
                                    canalCosa: this._canal_control.serializar()};
        this._portal_busquedas.enviarMensaje(otro_mensaje);  
    },
    hacerPedidoDeBusquedas: function(){
        var self = this;
        this._portal_busquedas.pedirMensajes(new FiltroAND([    new FiltroXClaveValor("tipoDeMensaje", "vortexComm.inventario.busquedaDeCosas"),
                                                                new FiltroXClaveValor("autor", this._autor)
                                                            ]),
                                             function(){
                                                 self.enviarCosa(self._portal_busquedas);
                                             });    
        this._portal_control.pedirMensajes(new FiltroXClaveValor("tipoDeMensaje", "vortexComm.inventario.busquedaDeCosas"),
                                             function(){
                                                 self.enviarCosa(self._portal_control);
                                             });    
    },
    conectarCon: function(un_nodo){
        this._router.conectarCon(un_nodo);   
    },
    recibirMensaje: function(un_mensaje){
        this._router.recibirMensaje(un_mensaje);
    },
    enviarCosa : function(portal) {
        var mensaje = {tipoDeMensaje: "vortexComm.inventario.cosa", 
                                    nombre: this._autor,
                                    descripcion: this._titulo,
                                    canalCosa: this._canal_control.serializar()};
        if( portal !== undefined) {portal.enviarMensaje(mensaje); 
                                    return;}
        this._portal_control.enviarMensaje(mensaje);
        var otro_mensaje = {tipoDeMensaje: "vortexComm.inventario.cosa", 
                                    nombre: this._autor,
                                    descripcion: this._titulo,
                                    canalCosa: this._canal_control.serializar()};
        this._portal_busquedas.enviarMensaje(otro_mensaje);  
    }
};