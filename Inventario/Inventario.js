var Cosa = function(cfg){
    self = this;
    var nombre = cfg.nombre;
    var router = cfg.router;
    var portal = new NodoPortalBidi();
    router.conectarCon(portal);
    portal.conectarCon(router);
    portal.pedirMensajes(   new FiltroXClaveValor('tipoDeMensaje', 'VortexComm.Inventario.Cosa.CambioDeNombre'),
                            function(m){
                                self.nombre(m.nuevoNombre);
                            });
    
    self.nombre = function(un_nombre){ 
        if(un_nombre===undefined) return nombre;
        nombre = un_nombre;
    };
}
    
var RepresentacionDeCosa = function(cfg){
    self = this;
    var nombre = cfg.nombre;
    var router = cfg.router;
    var portal = new NodoPortalBidi();
    router.conectarCon(portal);
    portal.conectarCon(router);
    
    self.nombre = function(un_nombre){ 
        if(un_nombre===undefined) return nombre;
        portal.enviarMensaje({
            tipoDeMensaje:'VortexComm.Inventario.Cosa.CambioDeNombre',
            nuevoNombre: un_nombre
        });
    };
    
    self.hayUnaCosaConectada = function(){
        return portal.filtroDeSalida().evaluarMensaje({tipoDeMensaje: "VortexComm.Inventario.Cosa.CambioDeNombre"});        
    };
}