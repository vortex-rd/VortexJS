var VistaDeBiblioteca = function(plantilla){
    this._plantilla = plantilla;
    this._input_autor_en_alta = plantilla.find('#input_nombre_autor_del_alta_de_libros');
    this._input_titulo_en_alta = plantilla.find('#input_titulo_del_alta_de_libros');
    this._boton_alta_de_libro = plantilla.find('#boton_agregar_del_alta_de_libros');
    
    var self = this;
    this._boton_alta_de_libro.click(function(){
        self._controlador.enviarComandoDeAgregarLibro(
            new Libro({
                titulo:self._input_titulo_en_alta.val(), 
                autor:self._input_autor_en_alta.val()
            })
        );
    });
    
}

VistaDeBiblioteca.prototype = {
    dibujarEn: function(panel){
        panel.append(this._plantilla);
    },
    controlador : function(un_controlador) {
        this._controlador = un_controlador;
    }
};

var ControladorDeVistaDeBiblioteca = function(una_vista_de_biblioteca, un_router){
    this._vista = una_vista_de_biblioteca;
    this._router = un_router;   

    this._portal = new NodoPortalBidi("biblioteca");
    this._router.conectarCon(this._portal);
    this._portal.conectarCon(this._router); 
    
    this._vista.controlador(this);
}
    
ControladorDeVistaDeBiblioteca.prototype = { 
    enviarComandoDeAgregarLibro : function(un_libro) {
        this._portal.enviarMensaje({tipoDeMensaje: "vortexComm.biblioteca.agregarLibro", 
                                    autor:un_libro.autor(),
                                    titulo: un_libro.titulo()});
    }
};