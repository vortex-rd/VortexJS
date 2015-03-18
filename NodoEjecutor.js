/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/
var NodoEjecutor = function(opt){
    this.vecino = new NodoNulo();
    this.filtroEnviado = new FiltroFalse();
    this.callback = function(){};    
    this.aliasPortal = "portal " + opt.alias;
};

NodoEjecutor.prototype.when = function(filtro, callback){
    this.callback = callback;
    var publicacion_de_filtro = {
        tipoDeMensaje : "Vortex.Filtro.Publicacion",
        filtro: filtro.serializar()
    }         
    this.vecino.recibirMensaje(publicacion_de_filtro, this);  
};

NodoEjecutor.prototype.recibirMensaje = function(un_mensaje, vecino_emisor) {
    var _this = this;		
    if(pedido.filtro.evaluarMensaje(un_mensaje)){
        pedido.callback(un_mensaje);
    }      
};

NodoEjecutor.prototype.conectarCon = function(un_vecino){    
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

if(typeof(require) != "undefined"){ exports.clase = NodoEjecutor;}