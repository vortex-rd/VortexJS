/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

if(typeof(require) != "undefined"){
    var FiltroOR = require("./FiltrosYTransformaciones").FiltroOR;
    var FiltroAND = require("./FiltrosYTransformaciones").FiltroAND;
}

var NodoPortal = function(opt){
    this._datosDelVecino = {
        vecino: new NodoNulo(),
        filtroRecibido: new FiltroFalse(),
        filtroEnviado: new FiltroFalse()
    };
    
    this._pedidos = [];
    this._aliasPortal = "portal " + opt.aliasPortal;
};

NodoPortal.prototype.send = function(un_mensaje, callback){
    if(this._datosDelVecino.filtroRecibido.evaluarMensaje(un_mensaje)){
        this._datosDelVecino.vecino.recibirMensaje(un_mensaje);        
    }
};

NodoPortal.prototype.when = function(filtro, callback){
    this._listaPedidos.push({ "filtro": filtro, "callback": callback});
    this.publicarFiltros();
};


NodoPortal.prototype.publicarFiltros = function(){
    var filtros = [];
    this._listaPedidos.forEach(function(p){
        filtros.push(p.filtro);
    });
    var filtroMergeado = new FiltroOR(filtros).simplificar();
    this._pata.publicarFiltro(filtroMergeado);
};



NodoPortal.prototype.recibirMensaje = function(un_mensaje, vecino_emisor) {
    var _this = this;
    //si es una publicacion de filtros
    if(un_mensaje.tipoDeMensaje == "Vortex.Filtro.Publicacion"){   
        if(_vecino !== vecino_emisor) return;
        var _filtro_recibido = DesSerializadorDeFiltros.desSerializarFiltro(un_mensaje.filtro);
        return;
    }
    
    this._listaPedidos.forEach(function (pedido) {					
        if(pedido.filtro.evaluarMensaje(un_mensaje)){
            pedido.callback(un_mensaje);
        }
    });	        
};

NodoPortal.prototype.conectarCon = function(un_vecino){    
    if(this._vecino === un_vecino) return; 
    if(!datos_del_vecino) {
        var datos_del_vecino = {
            vecino: un_vecino,
            filtroRecibido: new FiltroFalse(),
            filtroEnviado: new FiltroFalse()
        };
        this._datosDeLosVecinos.push(datos_del_vecino);   
        this.mergearYEnviarFiltros();
        un_vecino.conectarCon(this);
    }    
};

if(typeof(require) != "undefined"){ exports.clase = NodoPortal;}