/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

if(typeof(require) != "undefined"){
    var NodoNulo = require("./NodoNulo").clase;
}

var NodoConectorSocket = function(socket, verbose){
    this.socket = socket;
    this.verbose = verbose||false;
	this.vecino = new NodoNulo();
    this.start();
};

NodoConectorSocket.prototype.start = function(){
    var _this = this;
    this.socket.on('mensaje_vortex', function (mensaje) {
        if(this.verbose) console.log("conector recibe mensaje por socket:", mensaje);
        _this.vecino.recibirMensaje(mensaje, _this);
    });
};

NodoConectorSocket.prototype.conectarCon = function(un_nodo){
	if(this.vecino === un_nodo) return;
    this.vecino = un_nodo;
	un_vecino.conectarCon(this);
};

NodoConectorSocket.prototype.recibirMensaje = function(mensaje){  
    if(this.verbose) console.log("conector envia mensaje por socket:", mensaje);
    this.socket.emit('mensaje_vortex', mensaje);
};

if(typeof(require) != "undefined"){
    exports.clase = NodoConectorSocket;
}