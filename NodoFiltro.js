if(typeof(require) != "undefined"){
    var FiltroTrue = require("./FiltrosYTransformaciones").FiltroTrue;
    var ReceptorNulo = require("./ReceptorNulo").clase;
}

var NodoFiltro = function(un_filtro){
    this.filtro = un_filtro || new FiltroTrue;
    this.receptor = new ReceptorNulo();
};

NodoFiltro.prototype.conectarCon = function(un_receptor){
    this.receptor = un_receptor;
};

NodoFiltro.prototype.recibirMensaje = function(un_mensaje){
    if(this.filtro.evaluarMensaje(un_mensaje)) this.receptor.recibirMensaje(un_mensaje);
};

if(typeof(require) != "undefined"){ exports.clase = NodoFiltro;}