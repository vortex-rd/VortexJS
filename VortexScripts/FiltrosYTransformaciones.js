/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

var DesSerializadorDeFiltros = function(){
	this.DesSerializarFiltro = function(un_filtro_serializado){
        var filtro;
		switch(un_filtro_serializado.tipo)
		{
			case 'EQ':
				filtro =  new FiltroXClaveValor();
				break;
			case 'AND':
				filtro =  new FiltroAND();
				break;
            case 'OR':
				filtro =  new FiltroOR();
				break;
			case 'TRUE':
				filtro =  new FiltroTrue();
				break;
            case 'FALSE':
				filtro =  new FiltroFalse();
				break;
			default:
				filtro =  new FiltroDesconocido();
		}
		filtro.DesSerializar(un_filtro_serializado);
		return filtro;
	}
}

var FiltroXClaveValor = function (clave, valor) {
	this._clave = clave;
	this._valor = valor;
	this.clave = function(c){
        this._clave = c;
        this.change();
    }
    
    this.valor = function(v){
        this._valor = v;
        this._observador.cambioElFiltro(this);
    }
    
    this._observador = {cambioElFiltro : function(filtro){}};
    
    this.onChange = function(observador){
        this._observador = observador;
    }

    this.evaluarMensaje = function (un_mensaje) {
        return un_mensaje[this._clave] == this._valor;
    }

	this.Serializar= function(){
		return {'tipo': 'EQ',
				'clave': this._clave, 
				'valor': this._valor};
	}
	
	this.DesSerializar= function(un_filtro_serializado){
		this._clave = un_filtro_serializado.clave; 
		this._valor = un_filtro_serializado.valor; 
	}
}

var DesSerializadorDeTrafos = function(){
	this.DesSerializarTrafo = function(una_trafo_serializada){
        var trafo;
		switch(una_trafo_serializada.tipo)
		{
			case 'COMP':
				trafo =  new TrafoCompuesta();
				break;
			case 'KEYVALUE':
				trafo =  new TrafoXClaveValor();
				break;
		}
		trafo.desSerializar(una_trafo_serializada);
		return trafo;
	}
}

var TrafoXClaveValor = function (clave, valor) {
	this.clave = clave;
	this.valor = valor;
};
TrafoXClaveValor.prototype = {
    transformarMensaje : function (un_mensaje) {
    	un_mensaje[this.clave] = this.valor;
        return un_mensaje;
    },
    serializar : function(){
		return {	tipo: 'KEYVALUE',
					clave: this.clave,
                    valor: this.valor};
	},	
	desSerializar : function(una_trafo_serializada){
        this.clave = una_trafo_serializada.clave; 
		this.valor = una_trafo_serializada.valor; 
	}
};

var TrafoCompuesta = function(trafos){
    this.trafos = (trafos === undefined)? [] : trafos;
};
TrafoCompuesta.prototype = {
    transformarMensaje : function (un_mensaje) {
        for(var i=0; i<this.trafos.length; i++){
			this.trafos[i].transformarMensaje(un_mensaje);
		}
        return un_mensaje;
    },
    serializar : function(){
		var ret = {	tipo: 'COMP',
					trafos: []};
		for(var i=0; i<this.trafos.length; i++){
			ret.trafos.push(this.trafos[i].serializar());
		}		
		return ret;
	},	
	desSerializar : function(una_trafo_serializada){
		var desSerializador = new DesSerializadorDeTrafos();
		for(var i=0; i<una_trafo_serializada.trafos.length; i++){
			this.trafos.push(desSerializador.DesSerializarTrafo(una_trafo_serializada.trafos[i]));
		}
	}
};


var FiltroXParametro = function (parametro) {
	this.parametro = parametro;
    this.evaluarMensaje = function (un_mensaje) {
        if (un_mensaje[this.parametro.clave] == this.parametro.valor) { 
            return true; }
        else { 
            return false; }
    }

	this.ToString= function(){
		return JSON.stringify({'clave': this.parametro.clave, 'valor': this.parametro.valor});
	}
}

var TrafoXParametro= function (parametro) {
	this.parametro = parametro;
    this.transformarMensaje = function (un_mensaje) {
    	un_mensaje[this.parametro.clave] = this.parametro.valor;
        return un_mensaje;
    }

	this.ToString= function(){
		return JSON.stringify({'clave': this.parametro.clave, 'valor': this.parametro.valor});
	}
}

var FiltroAND = function (_filtros) {
	this.filtros = (_filtros === undefined)? [] : _filtros;
    
    this.evaluarMensaje = function (un_mensaje) {
        var valorRetorno = true;
		for(var i=0; i<this.filtros.length; i++){
			var evaluacion = this.filtros[i].evaluarMensaje(un_mensaje);
			if (evaluacion == false) { 
				return false;
			}
			if (evaluacion === undefined) { 
				valorRetorno = undefined;
			}
		}
        return valorRetorno;
    }
    
    this._observador = {cambioElFiltro : function(filtro){}};
    
    var self = this;
    this.filtros.forEach(function(filtro){
        filtro.onChange(self);
    });
    
    this.onChange = function(observador){
        this._observador = observador;
    }
    
    this.cambioElFiltro =  function(filtro){
        this._observador.cambioElFiltro(this); 
    }
    
	this.Serializar= function(){
		var ret = {	'tipo': 'AND',
					'filtros': []};
		for(var i=0; i<this.filtros.length; i++){
			ret.filtros.push(this.filtros[i].Serializar());
		}		
		return ret;
	}
	
	this.DesSerializar= function(un_filtro_serializado){
		var desSerializador = new DesSerializadorDeFiltros();
		for(var i=0; i<un_filtro_serializado.filtros.length; i++){
			this.filtros.push(desSerializador.DesSerializarFiltro(un_filtro_serializado.filtros[i]));
		}
	}
}

var FiltroOR = function (_filtros) {
	this.filtros = (_filtros === undefined)? [] : _filtros;
    
    this.evaluarMensaje = function (un_mensaje) {
        var valorRetorno = false;
		for(var i=0; i<this.filtros.length; i++){
			var evaluacion = this.filtros[i].evaluarMensaje(un_mensaje);
			if (evaluacion == true) { 
				return true;
			}
			if (evaluacion === undefined) { 
				valorRetorno = undefined;
			}
		}
        return valorRetorno;
    }
	
    this._observador = {cambioElFiltro : function(filtro){}};
    
    var self = this;
    this.filtros.forEach(function(filtro){
        filtro.onChange(self);
    });
    
    this.onChange = function(observador){
        this._observador = observador;
    }
    
    this.cambioElFiltro =  function(filtro){
        this._observador.cambioElFiltro(this); 
    }
    
	this.Serializar= function(){
		var ret = {	'tipo': 'OR',
					'filtros': []};
		for(var i=0; i<this.filtros.length; i++){
			ret.filtros.push(this.filtros[i].Serializar());
		}		
		return ret;
	}
	
	this.DesSerializar= function(un_filtro_serializado){
		var desSerializador = new DesSerializadorDeFiltros();
		for(var i=0; i<un_filtro_serializado.filtros.length; i++){
			this.filtros.push(desSerializador.DesSerializarFiltro(un_filtro_serializado.filtros[i]));
		}
	}
}
        
var FiltroDesconocido = function(){
	this.evaluarMensaje = function (un_mensaje) {
        return undefined;
    }
    
    this.onChange = function(observador){
        this._observador = observador;
    }
    
    this.Serializar= function(){
		var ret = {	'tipo': '?'};
		return ret;
	}
	
	this.DesSerializar= function(un_filtro_serializado){
	}
}

var FiltroTrue = function(){
	this.evaluarMensaje = function (un_mensaje) {
        return true;
    }
    
    this.onChange = function(observador){
        this._observador = observador;
    }
    
    this.Serializar= function(){
		var ret = {	'tipo': 'TRUE'};
		return ret;
	}
	
	this.DesSerializar= function(un_filtro_serializado){
	}
}

var ComparadorDeFiltros = {
    compararFiltros : function(filtro1, filtro2){
        if(filtro1 === undefined || filtro2 === undefined) return false;
        return JSON.stringify(filtro1.Serializar()) == JSON.stringify( filtro2.Serializar());
    }
}
    
var FiltroFalse = function(){
	this.evaluarMensaje = function (un_mensaje) {
        return false;
    }
    
    this.onChange = function(observador){
        this._observador = observador;
    }
    
    this.Serializar= function(){
		var ret = {	'tipo': 'FALSE'};
		return ret;
	}
	
	this.DesSerializar= function(un_filtro_serializado){
	}
}
