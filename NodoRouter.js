/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

var NodoRouter = function(){
    this.datosVecinos = [];
};

NodoRouter.prototype.send = function (un_mensaje, callback) {
    _.forEach(this.datosVecinos, function (datos_de_un_vecino) {
        if(datos_de_un_vecino.filtroRecibido.evaluarMensaje(un_mensaje)){ 
            setTimeout(function(){              
                datos_de_un_vecino.vecino.recibirMensaje(un_mensaje, this);  
            },0);
        }
    });
};

NodoRouter.prototype.when = function (filtro, callback) {
    
};

NodoRouter.prototype.recibirMensaje = function (un_mensaje, vecino_emisor) {
    var _this = this;
    //si es una publicacion de filtros
    if(un_mensaje.tipoDeMensaje == "Vortex.Filtro.Publicacion"){   
        var datos_del_vecino_emisor = _.find(this.datosVecinos, function(datos_de_un_vecino){ return datos_de_un_vecino.vecino === vecino_emisor});
        //si no conozco al vecino me rajo
        if(!datos_del_vecino_emisor) return;
        datos_del_vecino_emisor.filtroRecibido = DesSerializadorDeFiltros.desSerializarFiltro(un_mensaje.filtro);
        this.mergearYEnviarFiltros();
        return;
    }
    //si no, envío a todos los vecinos menos al que me me mandó el mensaje
    _.forEach(this.datosVecinos, function (datos_de_un_vecino) {
        if(vecino_emisor === datos_de_un_vecino.vecino) return;
        if(datos_de_un_vecino.filtroRecibido.evaluarMensaje(un_mensaje)){ 
            setTimeout(function(){              
                datos_de_un_vecino.vecino.recibirMensaje(un_mensaje, this);  
            },0);
        }
    });
};

NodoRouter.prototype.conectarCon = function(un_vecino) {
    var datos_del_vecino = _.find(this.datosVecinos, function(datos_de_un_vecino){ return datos_de_un_vecino.vecino === un_vecino });
    if(!datos_del_vecino) {
        var datos_del_vecino = {
            vecino: un_vecino,
            filtroRecibido: new FiltroFalse(),
            filtroEnviado: new FiltroFalse()
        };
        this.datosVecinos.push(datos_del_vecino);   
        this.mergearYEnviarFiltros();
        un_vecino.conectarCon(this);
    }    
};

NodoRouter.prototype.mergearFiltrosParaUnVecino = function(datos_del_vecino){
    var filtros_para_el_vecino = [];
    _.forEach(this.datosVecinos, function (datos_de_un_vecino) {
        if(datos_del_vecino === datos_de_un_vecino ) return;
        filtros_para_el_vecino.push(datos_de_un_vecino.filtroRecibido);
    });
    var filtro_a_publicar_al_vecino = new FiltroOR(filtros_para_el_vecino).simplificar();
    if(filtro_a_publicar_al_vecino.equals(datos_del_vecino.filtroEnviado)) return;
    datos_del_vecino.filtroEnviado = filtro_a_publicar_al_vecino;
    var publicacion_de_filtro = {
        tipoDeMensaje : "Vortex.Filtro.Publicacion",
        filtro: filtro_a_publicar_al_vecino.serializar()
    }
        var _this = this;
    setTimeout(function(){              
        datos_del_vecino.vecino.recibirMensaje(publicacion_de_filtro, _this);  
    },0);	    
};

NodoRouter.prototype.mergearYEnviarFiltros = function(){
    //para cada vecino mergeo los filtros de los demas
    _.forEach(this.datosVecinos, function (datos_de_un_vecino) {            
        _this.mergearFiltrosParaUnVecino(datos_de_un_vecino);
    });
};