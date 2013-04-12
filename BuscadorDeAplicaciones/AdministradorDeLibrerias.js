var NodoAdministradorDeLibrerias = function(cfg){    
    this.idAdministrador = cfg.idAdministrador;
    this.start();
};

NodoAdministradorDeLibrerias.prototype = {
    start:function(){
        this.librerias = [];
        this.router = new NodoRouter("administrador de librerias");
        this.portal = new NodoPortalBidi("administrador de librerias");
        this.router.conectarBidireccionalmenteCon(this.portal);        
        
        this.portal.pedirMensajes(new FiltroAND([new FiltroXClaveValor("tipoDeMensaje", "vortexComm.market.libreria"),
                                                   new FiltroXClaveValor("idSolicitante", this.idAdministrador)]),
                                    this.recibirMensajeLibreria.bind(this));  
    },
    recibirMensajeLibreria:function(un_mensaje){
        if(this.tengoLaLibreria(un_mensaje.nombre, un_mensaje.version)) return;
        $("head").append($(un_mensaje.estilo));
        $.globalEval(un_mensaje.script); 
        this.librerias.push(un_mensaje);        
    },
    tengoLaLibreria:function(nombre, version){
        for(i=0; i<this.librerias.length; i++){
            var lib = this.librerias[i];
            if(lib.nombre == nombre && lib.version>= version) return true;
        }
        return false;        
    },
    conectarCon: function(un_nodo){
        this.router.conectarCon(un_nodo);
    },
    recibirMensaje: function(un_mensaje){
        this.router.recibirMensaje(un_mensaje);
    }
};