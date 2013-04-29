var NodoProveedorDeLibreria = function(cfg){    
    this.libreria = cfg.libreria;
    this.start();
};

NodoProveedorDeLibreria.prototype = {
    start:function(){
        this.router = new NodoRouter("proveedor de libreria");
        this.portal = new NodoPortalBidi("proveedor de libreria");
        this.router.conectarBidireccionalmenteCon(this.portal);        
        
        this.portal.pedirMensajes(new FiltroAND([new FiltroXClaveValor("tipoDeMensaje", "vortexComm.market.busquedaDeLibrerias"),
                                                   new FiltroXClaveValor("nombre", this.libreria.nombre)]),
                                    this.enviarResumen.bind(this));  
        this.portal.pedirMensajes(new FiltroAND([new FiltroXClaveValor("tipoDeMensaje", "vortexComm.market.pedidoDeLibreria"),
                                                   new FiltroXClaveValor("nombre", this.libreria.nombre),
                                                   new FiltroXClaveValor("version", this.libreria.version)]),
                                    this.enviarLibreria.bind(this));  
    },
    enviarResumen:function(){
        this.portal.enviarMensaje({tipoDeMensaje:"vortexComm.market.resumenLibreria",
                                     nombre:this.libreria.nombre,
                                     version: this.libreria.version,
                                     descripcion: this.libreria.descripcion
                                    });
    },
    enviarLibreria:function(mensaje){
        this.portal.enviarMensaje({tipoDeMensaje: "vortexComm.market.libreria",
                                    idSolicitante: mensaje.idSolicitante,
                                     nombre: this.libreria.nombre,
                                     version: this.libreria.version,
                                     descripcion: this.libreria.descripcion,
                                     dependencias: this.libreria.dependencias,
                                     script: this.libreria.script()
                                    });
    },
    conectarCon: function(un_nodo){
        this.router.conectarCon(un_nodo);
    },
    recibirMensaje: function(un_mensaje){
        this.router.recibirMensaje(un_mensaje);
    }
};