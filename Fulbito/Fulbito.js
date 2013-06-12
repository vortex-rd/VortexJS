 $(function () { 
    var router =  new NodoRouter("principal"); 
    
    var clienteHTTP = new NodoClienteHTTP('http://kfgodel.info:62626/vortex', 100);             
    router.conectarBidireccionalmenteCon(clienteHTTP);
     
    var panel_principal = $('#panel_principal');
    var plantillas = $('#plantillas');
    var ui_nodo_fulbito_server = plantillas.find('#plantilla_fulbito').clone();
    
    var nodo_fulbito_server = new NodoFulbitoServer();
    router.conectarBidireccionalmenteCon(nodo_fulbito_server);
     
    var nodo_fulbito_cliente = new NodoFulbitoCliente({UI:ui_nodo_fulbito});
    router.conectarBidireccionalmenteCon(nodo_fulbito_cliente);
     
    nodo_fulbito_cliente.dibujarEn(panel_principal);
});