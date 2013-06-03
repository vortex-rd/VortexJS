var NodoAltaDeCosa = function(o){
    this.o = o;
    this.start();
};

NodoAltaDeCosa.prototype.start = function(){
    this.input_nombre = this.o.ui.find('#input_nombre');
    this.input_descripcion = this.o.ui.find('#input_descripcion');
    this.boton_agregar = this.o.ui.find('#boton_agregar');
    this.div_estado_alta = this.o.ui.find('#estado_alta');
};
