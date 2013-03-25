var NodoVistaDeBiblioteca = function(cfg){
    this._ui = cfg.UI;
    this._input_autor_en_alta = this._ui.find('#input_nombre_autor_del_alta_de_libros');
    this._input_titulo_en_alta = this._ui.find('#input_titulo_del_alta_de_libros');
    this._boton_alta_de_libro = this._ui.find('#boton_agregar_del_alta_de_libros');
    this._boton_refrescar = this._ui.find('#boton_refrescar_del_alta_de_libros');
    this._panel_libros = this._ui.find('#panel_libros_en_vista_de_libros');   
    
    this._plantilla_libro = cfg.plantilla_libro;
    
    this.start();
}

NodoVistaDeBiblioteca.prototype = {
    start: function(){
        this._router = new NodoRouter("vista biblioteca");
        this._portal = new NodoPortalBidi("vista biblioteca")
        this._router.conectarBidireccionalmenteCon(this._portal);
        
        this._portal.pedirMensajes(new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.libro"),
                          this.onLibroEncontrado.bind(this));  
        var self = this;
        this._boton_alta_de_libro.click(function(){
            self.enviarComandoDeAgregarLibro(
                new Libro({
                    titulo:self._input_titulo_en_alta.val(), 
                    autor:self._input_autor_en_alta.val()
                })
            );
        });
        this._boton_alta_de_libro.click(this.enviarComandoDeBuscarLibros.bind(this));
    },
    enviarComandoDeAgregarLibro : function(un_libro) {
        this._portal.enviarMensaje({tipoDeMensaje: "vortexComm.biblioteca.agregarLibro", 
                                    autor:un_libro.autor(),
                                    titulo: un_libro.titulo()});
    },
    enviarComandoDeBuscarLibros : function() {
        this._portal.enviarMensaje({tipoDeMensaje: "vortexComm.biblioteca.pedidoDeLibros"});
    },
    onLibroEncontrado : function (mensaje) {
        var libro = new Libro(mensaje);                
        this.nuevoLibroEncontrado(libro);
    },
    nuevoLibroEncontrado : function(un_libro) {  
        var vista_libro = new VistaDeLibroEnBuscador(un_libro, this._plantilla_libro.clone());
        vista_libro.dibujarEn(this._panel_libros);      
    },
    dibujarEn: function(panel){
        panel.append(this._ui);
    },
    conectarCon: function(un_nodo){
        this._router.conectarCon(un_nodo);   
    },
    recibirMensaje: function(un_mensaje){
        console.log("Nodo vista de biblioteca recibe mensaje:", un_mensaje)
        this._router.recibirMensaje(un_mensaje);
    } 
}
//
//
//var VistaDeBiblioteca = function(plantilla, plantilla_libro){
//    this._plantilla = plantilla;
//    this._input_autor_en_alta = plantilla.find('#input_nombre_autor_del_alta_de_libros');
//    this._input_titulo_en_alta = plantilla.find('#input_titulo_del_alta_de_libros');
//    this._boton_alta_de_libro = plantilla.find('#boton_agregar_del_alta_de_libros');
//    this._boton_refrescar = plantilla.find('#boton_refrescar_del_alta_de_libros');
//    this._panel_libros = plantilla.find('#panel_libros_en_vista_de_libros');
//    
//    var self = this;
//    this._boton_alta_de_libro.click(function(){
//        self._controlador.enviarComandoDeAgregarLibro(
//            new Libro({
//                titulo:self._input_titulo_en_alta.val(), 
//                autor:self._input_autor_en_alta.val()
//            })
//        );
//    });
//    this._boton_alta_de_libro.click(function(){
//        self._controlador.enviarComandoDeBuscarLibros();
//    });    
//}
//
//VistaDeBiblioteca.prototype = {
//    dibujarEn: function(panel){
//        panel.append(this._plantilla);
//    },
//    controlador : function(un_controlador) {
//        this._controlador = un_controlador;
//    },
//    nuevoLibroEncontrado : function(un_libro) {  
//        var vista_libro = new VistaDeLibroEnBuscador(libro, self._plantilla_libro.clone());
//        vista_libro.dibujarEn(self._panel_libros);      
//    }
//};
//
//var ControladorDeVistaDeBiblioteca = function(una_vista_de_biblioteca, un_router){
//    this._vista = una_vista_de_biblioteca;
//    this._router = un_router;   
//
//    this._portal = new NodoPortalBidi("vista biblioteca");
//    this._router.conectarCon(this._portal);
//    this._portal.conectarCon(this._router); 
//    
//    this._vista.controlador(this);
//    this._portal.pedirMensajes(new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.libro"),
//                      function(mensaje){self.onLibroEncontrado(mensaje);});  
//}
//    
//ControladorDeVistaDeBiblioteca.prototype = { 
//    enviarComandoDeAgregarLibro : function(un_libro) {
//        this._portal.enviarMensaje({tipoDeMensaje: "vortexComm.biblioteca.agregarLibro", 
//                                    autor:un_libro.autor(),
//                                    titulo: un_libro.titulo()});
//    },
//    enviarComandoDeBuscarLibros : function() {
//        this._portal.enviarMensaje({tipoDeMensaje: "vortexComm.biblioteca.pedidoDeLibros"});
//    },
//    onLibroEncontrado : function (mensaje) {
//        var libro = new Libro({autor:mensaje.autor, titulo:mensaje.titulo});                
//        this._vista.nuevoLibroEncontrado(libro);
//    }
//};