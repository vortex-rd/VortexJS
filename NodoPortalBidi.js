/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

if(typeof(require) != "undefined"){
    var GeneradorDeIdMensaje = require("./GeneradorDeIdMensaje").clase;
    var NodoMultiplexor = require("./NodoMultiplexor").clase;
    var FiltroOR = require("./FiltrosYTransformaciones").FiltroOR;
    var FiltroAND = require("./FiltrosYTransformaciones").FiltroAND;
    var FiltroXClaveValor = require("./FiltrosYTransformaciones").FiltroXClaveValor;
}

var NodoPortalBidi = function(aliasPortal){
    var _this = this;
    this.receptor = new ReceptorNulo();
    
    this.muxEntrada = new NodoMultiplexor();
    
    this.muxEntrada.conectarCon(new NodoConsumidorCondicional(new FiltroXClaveValor("tipoDeMensaje", "Vortex.IdRemoto.Pedido"), 
                                                  function(pedido){_this.recibirPedidoDeIdRemoto(pedido)}));
    this.muxEntrada.conectarCon(new NodoConsumidorCondicional(new FiltroXClaveValor("tipoDeMensaje", "Vortex.IdRemoto.Respuesta"), 
                                                  function(respuesta){_this.recibirRespuestaAPedidoDeIdRemoto(respuesta)}));
    this.muxEntrada.conectarCon(new NodoConsumidorCondicional(new FiltroXClaveValor("tipoDeMensaje", "Vortex.IdRemoto.Confirmacion"), 
                                                  function(confirmacion){_this.recibirConfirmacionDePedidoDeIdRemoto(confirmacion)}));    
    this.muxEntrada.conectarCon(new NodoConsumidorCondicional(new FiltroXClaveValor("tipoDeMensaje", "Vortex.IdRemoto.ReConfirmacion"), 
                                                  function(reconfirmacion){_this.recibirReConfirmacionDePedidoDeIdRemoto(reconfirmacion)}));    
    this.muxEntrada.conectarCon(new NodoConsumidorCondicional(new FiltroXClaveValor("tipoDeMensaje", "Vortex.Filtro.Publicacion"), 
                                                  function(publicacion){_this.recibirPublicacionDeFiltro(publicacion)}));
    
    this.nodoFiltroDeSalida = new NodoFiltro();
};

NodoPortalBidi.prototype.enviarMensaje = function(un_mensaje){
    
};

NodoPortalBidi.prototype.pedirMensajes = function(un_filtro, un_callback){
    this.muxEntrada.conectarCon(new NodoConsumidorCondicional(un_filtro, un_callback));
};

NodoPortalBidi.prototype.recibirMensaje = function(un_mensaje) {
    this.muxEntrada.recibirMensaje(un_mensaje);
};

NodoPortalBidi.prototype.conectarCon = function(un_receptor){
    this.receptor = un_receptor;
};

NodoPortalBidi.prototype.conectarBidireccionalmenteCon = function (otro_nodo) {
    this.conectarCon(otro_nodo);
    otro_nodo.conectarCon(this);
};

NodoPortalBidi.prototype.conectadoBidireccionalmente = function(){
    
};

NodoPortalBidi.prototype.filtroDeSalida = function(){
    
};

if(typeof(require) != "undefined"){ exports.clase = NodoPortalBidi;}