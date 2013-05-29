var NodoVistaDeCosa = function(cfg){
    this._ui = $(cfg.UI);
    this._nombre = cfg.nombre;
    this._descripcion = cfg.descripcion;
    this._canal_cosa = cfg.canalCosa;
    this.start();
};

NodoVistaDeCosa.prototype = {
    start: function(){
        this._portal = new NodoPortalConCanal("vista de cosa en buscador", this._canal_cosa);
        
        this._label_nombre = this._ui.find('#nombre');
        this._label_descripcion = this._ui.find('#descripcion');
        
        this._label_nombre.text(this._nombre);
        this._label_descripcion.text(this._descripcion);
        
        this._portal.pedirMensajes(new FiltroXClaveValor("tipoDeMensaje", "vortexComm.inventario.cosaActualizada"),
                                   this.actualizar.bind(this));
    },  
    actualizar: function(cosa){
        this._label_nombre.text(cosa.nombre);
        this._label_descripcion.text(cosa.descripcion); 
    },
    dibujarEn: function(panel){
        panel.append(this._ui);
    },
    conectarCon: function(un_nodo){
        this._portal.conectarCon(un_nodo);   
    },
    recibirMensaje: function(un_mensaje){
        this._portal.recibirMensaje(un_mensaje);
    },
    equals: function(obj){
        if(!(obj instanceof NodoVistaDeCosa)) return false;
        return this._canal_cosa.equals(obj._canal_cosa);
    }
};