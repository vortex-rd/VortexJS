/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/


var CanalClaveValor = function(alias, clave, valor, super_canal){
    this._alias = alias;
    this._clave = clave;
    this._valor = valor;
    
    this.superCanal = super_canal;
    if(super_canal === undefined){
        this.superCanal = {
                estamparFiltro:function(un_filtro){
                    return new FiltroAND([un_filtro])
                },
                estamparMensaje:function(un_mensaje){
                    return un_mensaje;
                }
            }
    }
    this.start();
}

CanalClaveValor.prototype = {
    start:function(){
        this.filtro = new FiltroXClaveValor(this._clave, this._valor);
        this.trafo = new TrafoXClaveValor(this._clave, this._valor);

    },
    estamparFiltro: function(un_filtro){
        var sumaDeFiltros = this.superCanal.estamparFiltro(un_filtro);
        sumaDeFiltros.filtros.push(this.filtro);
        return sumaDeFiltros;     
    },
    estamparMensaje: function(un_mensaje){
        var mensajeTransformado = this.superCanal.estamparMensaje(un_mensaje);
        return this.trafo.transformarMensaje(mensajeTransformado);
    },
    setSuperCanal: function(un_canal){
        this.superCanal = un_canal;
    }
}