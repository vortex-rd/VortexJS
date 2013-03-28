var NodoLibro = function(cfg){
    this._id = cfg.id;
    this._titulo = cfg.titulo || "";
    this._autor = cfg.autor || "";
    this._id_biblioteca = cfg.idBiblioteca || "";
    this.start();
}
NodoLibro.prototype = {
    start: function(){
        this._router = new NodoRouter("libro " + this._id + " de la biblioteca " + this._id_biblioteca);
        this._portal = new NodoPortalBidi("libro" + this._id + " de la biblioteca " + this._id_biblioteca);
        this._portal.pedirMensajes(new FiltroAND([new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.edicionDelibro"),
                                                  new FiltroXClaveValor("idBiblioteca", this._id_biblioteca),
                                                  new FiltroXClaveValor("idLibro", this._id)]),
                                   this.actualizar.bind(this));
        this._router.conectarBidireccionalmenteCon(this._portal);
        
        this._portal_busquedas = new NodoPortalBidiMonoFiltro("libro" + this._id + " de la biblioteca " + this._id_biblioteca);
        this.hacerPedidoDeBusquedas();
        this._router.conectarBidireccionalmenteCon(this._portal_busquedas);
    },
    actualizar: function(libro){
        this._autor = libro.autor;
        this._titulo = libro.titulo;
        
        this.hacerPedidoDeBusquedas();
        this.enviarLibro();
    },
    hacerPedidoDeBusquedas: function(){
        this._portal_busquedas.pedirMensajes(new FiltroAND([    new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.busquedaDeLibros"),
                                                                new FiltroOR([  new FiltroXClaveValor("idBiblioteca", this._id_biblioteca),
                                                                                new FiltroXClaveValor("autor", this._autor)
                                                                             ])
                                                            ]),
                                             this.enviarLibro.bind(this));                        
    },
    conectarCon: function(un_nodo){
        this._router.conectarCon(un_nodo);   
    },
    recibirMensaje: function(un_mensaje){
        this._router.recibirMensaje(un_mensaje);
    },
    enviarLibro : function() {
        this._portal.enviarMensaje({tipoDeMensaje: "vortexComm.biblioteca.libro", 
                                    idLibro: this._id,
                                    autor: this._autor,
                                    titulo: this._titulo,
                                    idBiblioteca: this._id_biblioteca});
    }
};

var Libro = function(cfg){
    this._id = cfg.id;
    this._titulo = cfg.titulo || "";
    this._autor = cfg.autor || "";
    this._id_biblioteca = cfg.idBiblioteca || "";
}

Libro.prototype = {
    id : function() {
        return this._id;
    },
    titulo : function() {
        return this._titulo;
    },
    autor : function() {
        return this._autor;
    },
    idBiblioteca:function(){
        return this._id_biblioteca;
    }
};