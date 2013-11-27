if(typeof(require) != "undefined"){
    var NodoFiltro = require("./NodoFiltro").clase;
    var NodoConsumidor = require("./NodoConsumidor").clase;
}

var NodoConsumidorCondicional = function(un_filtro, un_callback){
    this.nodoFiltro = new NodoFiltro(un_filtro);
    this.nodoConsumidor = new NodoConsumidor(un_callback);
    this.nodoFiltro.conectarCon(this.nodoConsumidor);
};

NodoConsumidorCondicional.prototype.recibirMensaje = function(un_mensaje){
    this.nodoFiltro.recibirMensaje(un_mensaje);
};

if(typeof(require) != "undefined"){ exports.clase = NodoConsumidorCondicional;}