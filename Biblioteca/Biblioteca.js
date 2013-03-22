//bla bla
var FabricaDeBibliotecas = {
    crearBiblioteca : function(){
        return new Biblioteca();
    },
    crearBibliotecaConectadaALaRed : function(nodo){
        var portal_biblioteca = new NodoPortalBidi("biblioteca");
        nodo.conectarCon(portal_biblioteca);
        portal_biblioteca.conectarCon(nodo); 
        
        una_biblioteca = new Biblioteca();
        un_controlador_de_biblioteca = new ControladorDeBiblioteca(una_biblioteca, portal_biblioteca);
        
        return una_biblioteca;
    }
}
    
var Biblioteca = function(){    
    this._libros = [];
    this._controlador = {libroAgregado : function(){}};
}
Biblioteca.prototype ={
    libros : function(un_libro) {
        return Enumerable.From(this._libros);
    },
    agregarLibro : function(un_libro) {
        this._libros.push(un_libro);
        this._controlador.libroAgregado(un_libro);
    },
    buscarLibrosPorAutor : function(autor) {        
        return Enumerable.From(this._libros).Where(function(l){return l._autor == autor});
    },
    controlador : function(un_controlador) {
        this._controlador = un_controlador;
    },
    vista : function(una_vista) {
        this._vista = una_vista;
    }
};

var VistaDeBiblioteca = function(biblioteca, plantilla){
    this._biblioteca = biblioteca;
    this._plantilla = plantilla;
    this._input_autor_en_alta = plantilla.find('#input_nombre_autor_del_alta_de_libros');
    this._input_titulo_en_alta = plantilla.find('#input_titulo_del_alta_de_libros');
    this._boton_alta_de_libro = plantilla.find('#boton_agregar_del_alta_de_libros');
    
    var self = this;
    this._boton_alta_de_libro.click(function(){
        self._biblioteca.agregarLibro(
            new Libro({
                titulo:self._input_titulo_en_alta.val(), 
                autor:self._input_autor_en_alta.val()
            })
        );
    });
    
    this._biblioteca.vista(this); 
}

VistaDeBiblioteca.prototype = {
    dibujarEn: function(panel){
        panel.append(this._plantilla);
    }
};

var ControladorDeBiblioteca = function(una_biblioteca, un_portal){
    this._biblioteca = una_biblioteca;
    this._portal = un_portal;   
    
    var self = this;
    this._portal.pedirMensajes(new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.busquedaDeLibrosPorAutor"),  
                           function(mensaje){
                                self.onBusquedaPorAutorRecibida(mensaje);
                           });
    this._biblioteca.controlador(this);
}
    
ControladorDeBiblioteca.prototype = {
    onBusquedaPorAutorRecibida:  function (mensaje) {
        var librosEncontrados = this._biblioteca.buscarLibrosPorAutor(mensaje.autor);
        var self = this;        
        librosEncontrados.ForEach(function(l){
            self.enviarLibro(l);
        });
    },    
    libroAgregado : function(un_libro) {
        this.enviarLibro(un_libro);
    },
    enviarLibro : function(un_libro) {
        this._portal.enviarMensaje({tipoDeMensaje: "vortexComm.biblioteca.libro", 
                                    autor:un_libro.autor(),
                                    titulo: un_libro.titulo()});
    }
};