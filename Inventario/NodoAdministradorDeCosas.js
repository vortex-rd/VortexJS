var NodoAdministradorDeCosas = function(cfg){
    this._canal_control = cfg.canalControl;
    this._canal_busquedas = cfg.canalBusquedas;
    this._ui = cfg.UI;
    this._input_nombre_en_alta = this._ui.find('#input_nombre_en_alta');
    this._input_descripcion_en_alta = this._ui.find('#input_descripcion_en_alta');
    this._boton_agregar_en_alta = this._ui.find('#boton_agregar_en_alta');
    
    this._panel_lista_de_cosas_encontradas = this._ui.find('#panel_lista_de_cosas_encontradas');   
    
    this._plantilla_cosa = cfg.plantillaCosaEncontrada;
    
    this.start();
}

NodoAdministradorDeCosas.prototype = {
    start: function(){
        this._router = new NodoRouter("administrador de cosas");
        this._portal = new NodoPortalConCanal("administrador de cosas", this._canal_control);
        this._router.conectarBidireccionalmenteCon(this._portal);
        
        this._cosas_encontradas = [];
        
        this._portal.pedirMensajes(new FiltroXClaveValor("tipoDeMensaje", "vortexComm.inventario.cosa"),
                          this.onCosaEncontrada.bind(this));  
        var self = this;
        this._boton_agregar_en_alta.click(function(){
            self.enviarComandoDeAgregarCosa(
                {
                    nombre:self._input_nombre_en_alta.val(), 
                    descripcion:self._input_descripcion_en_alta.val()
                }
            );
        });
    },
    enviarComandoDeAgregarCosa : function(una_cosa) {
        this._portal.enviarMensaje({tipoDeMensaje: "vortexComm.inventario.agregarCosa", 
                                    nombre:una_cosa.nombre,
                                    descripcion: una_cosa.descripcion});
    },
    enviarComandoDeBuscarLibros : function() {
        this._portal.enviarMensaje({tipoDeMensaje: "vortexComm.biblioteca.busquedaDeLibros"});
    },
    onCosaEncontrada : function (mensaje) {
        var canal_cosa = new Canal();
        canal_cosa.desSerializar(mensaje.canalCosa);
        var vCosa = new NodoVistaDeCosa({UI: this._plantilla_cosa.clone(),
                                                  autor: mensaje.autor,
                                                  titulo: mensaje.titulo,
                                                  canalCosa: canal_cosa});
        
        if(this.cosasEncontradas().Any(function(vc){return vCosa.equals(vc);})) return;
        this._cosas_encontradas.push(vCosa);    
        
        this._router.conectarBidireccionalmenteCon(vCosa);
        vCosa.dibujarEn(this._panel_lista_de_cosas_encontradas);      
    },
    cosasEncontradas : function() {
        return Enumerable.From(this._cosas_encontradas);
    },  
    dibujarEn: function(panel){
        panel.append(this._ui);
    },
    conectarCon: function(un_nodo){
        this._router.conectarCon(un_nodo);   
    },
    recibirMensaje: function(un_mensaje){
        this._router.recibirMensaje(un_mensaje);
    } 
}