/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/


var CanalClaveValor = function(alias, clave, valor){
    this._alias = alias;
    this._clave = clave;
    this._valor = valor;
    
    this.start();
}

CanalClaveValor.prototype = {
    start:function(){
        this.filtro = new FiltroXClaveValor(this._clave, this._valor);
        this.trafo = new TrafoXClaveValor(this._clave, this._valor);
    },
    estamparFiltro: function(un_filtro){
        var canalYFiltro = [];
        canalYFiltro.push(this.filtro);
        canalYFiltro.push(un_filtro);
        return new FiltroAND(canalYFiltro);     
    },
    estamparMensaje: function(un_mensaje){
        return this.trafo.transformarMensaje(un_mensaje);
    }    
}