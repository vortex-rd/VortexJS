var scriptNodoBuscadorDeAplicaciones = function(){
    var NodoBuscadorDeAplicaciones = function(cfg){
        this._plantilla_aplicacion = $(cfg.plantilla_aplicacion);
        this._ui = $(cfg.UI);
        this.start();
    };
    
    NodoBuscadorDeAplicaciones.prototype = {
        start: function(){
            this._router = new NodoRouter("buscador de aplicaciones");
            this._portal = new NodoPortalBidiMonoFiltro("buscador de aplicaciones");
            this._router.conectarBidireccionalmenteCon(this._portal);
            
            this._aplicaciones_encontradas = [];
            this._input_busqueda = this._ui.find('#input_de_busqueda_del_buscador_de_aplicaciones');
            this._panel_aplicaciones_encontradas = this._ui.find('#lista_de_aplicaciones_encontradas_del_buscador_de_aplicaciones');
            
            this._input_busqueda.change(this.nuevoCriterioDeBusqueda.bind(this));
        },
        nuevoCriterioDeBusqueda : function(){
            this.pedirAplicacionesPorNombre(this._input_busqueda.val());
        },
        pedirAplicacionesPorNombre : function(nombre) {        
            this.limpiarAplicacionesEncontradas();
            this._portal.pedirMensajes(new FiltroAND([new FiltroXClaveValor("tipoDeMensaje", "vortexComm.market.resumenAplicacion"),
                                                        new FiltroXClaveValor("nombre", nombre)]),
                                  this.onAppEncontrada.bind(this));  
            this._portal.enviarMensaje({tipoDeMensaje: "vortexComm.market.busquedaDeAplicaciones", nombre:nombre});
        },
        limpiarAplicacionesEncontradas: function(){
            this._aplicaciones_encontradas = [];
            this._panel_aplicaciones_encontradas.empty();
        },
        onAppEncontrada : function (mensaje) {      
            var app = new NodoVistaDeAppEncontradaEnBuscador({UI: this._plantilla_aplicacion.clone(),
                                                              idApp: mensaje.idApp,
                                                              nombre: mensaje.nombre
                                                            });
            if(this.appsEncontradas().Any(function(l){return (l._id==app._id)})) return;
            this._aplicaciones_encontradas.push(app);    
    
            this._router.conectarBidireccionalmenteCon(app);
            app.dibujarEn(this._panel_aplicaciones_encontradas);        
        },
        appsEncontradas : function() {
            return Enumerable.From(this._aplicaciones_encontradas);
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
    };

    var NodoVistaDeAppEncontradaEnBuscador = function(cfg){
        this._ui = $(cfg.UI);
        this._id = cfg.idApp;
        this._nombre = cfg.nombre;
        this.start();
    };

    NodoVistaDeAppEncontradaEnBuscador.prototype = {
        start: function(){
            this._portal = new NodoPortalBidi("vista app en buscador" + this._id);
            
            this._label_nombre = this._ui.find('#nombre_de_app_encontrada');
            
            this._label_nombre.text(this._nombre);
            
            this._portal.pedirMensajes(new FiltroAND([new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.libro"),
                                                      new FiltroXClaveValor("idBiblioteca", this._id_biblioteca),
                                                      new FiltroXClaveValor("idLibro", this._id_libro)]),
                                       this.actualizar.bind(this));
        },  
        dibujarEn: function(panel){
            panel.append(this._ui);
        },
        conectarCon: function(un_nodo){
            this._portal.conectarCon(un_nodo);   
        },
        recibirMensaje: function(un_mensaje){
            this._portal.recibirMensaje(un_mensaje);
        } 
    };
};

scriptNodoBuscadorDeAplicaciones.script = function(){
    var script = scriptNodoBuscadorDelibros.toString();
    return script.substring(12, script.length-2);
};