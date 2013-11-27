var NodoConsumidor = function(un_callback){
    this.callback = un_callback || function(un_mensaje){};
};

NodoConsumidor.prototype.recibirMensaje = function(un_mensaje){
    this.callback(un_mensaje);
};

if(typeof(require) != "undefined"){ exports.clase = NodoConsumidor;}