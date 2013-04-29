var libreriaBuscadorDelibros = { 
    nombre: "BuscadorDeLibros",
    version: 0.1,
    dependencias: [],
    descripcion:"Un buscador de libros en bibliotecas",
    script: function(){
        var script = this.codigo.toString();
        return script.substring(12, script.length-2);
    },
    codigo: function(){
        var NodoBuscadorDeLibros = function(cfg){
            this._plantilla_libro = $(cfg.plantilla_libro);
            this._ui = $(cfg.UI);
            this._canal_busquedas = cfg.canalBusquedas;
            this.start();
        };
        
        NodoBuscadorDeLibros.prototype = {
            start: function(){
                this._router = new NodoRouter("buscador");
                this._portal = new NodoPortalBidiMonoFiltroConCanal("buscador", this._canal_busquedas);
                this._router.conectarBidireccionalmenteCon(this._portal);
                
                this._librosEncontrados = [];
                this._input_busqueda = this._ui.find('#input_de_busqueda_del_buscador_de_libros');
                this._panel_libros_encontrados = this._ui.find('#lista_de_libros_encontrados_del_buscador_de_libros');
                
                this._input_busqueda.change(this.nuevoCriterioDeBusqueda.bind(this));
            },
            nuevoCriterioDeBusqueda : function(){
                this.pedirLibrosPorAutor(this._input_busqueda.val());
            },
            pedirLibrosPorAutor : function(autor) {        
                this.limpiarLibrosEncontrados();
                this._portal.pedirMensajes(new FiltroAND([new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.libro"),
                                                            new FiltroXClaveValor("autor", autor)]),
                                      this.onLibroEncontrado.bind(this));  
                this._portal.enviarMensaje({tipoDeMensaje: "vortexComm.biblioteca.busquedaDeLibros", autor:autor});
            },
            limpiarLibrosEncontrados: function(){
                this._librosEncontrados = [];
                this._panel_libros_encontrados.empty();
            },
            onLibroEncontrado : function (mensaje) {      
                var canal_libro = new Canal();
                canal_libro.desSerializar(mensaje.canalLibro);
                var libro = new NodoVistaDeLibroEnBuscador({UI: this._plantilla_libro.clone(),
                                                          autor: mensaje.autor,
                                                          titulo: mensaje.titulo,
                                                          canalLibro: canal_libro
                                                        });
                if(this.librosEncontrados().Any(function(l){return libro.equals(l); })) return;
                this._librosEncontrados.push(libro);    
        
                this._router.conectarBidireccionalmenteCon(libro);
                libro.dibujarEn(this._panel_libros_encontrados);        
            },
            librosEncontrados : function() {
                return Enumerable.From(this._librosEncontrados);
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
    
        var NodoVistaDeLibroEnBuscador = function(cfg){
            this._ui = $(cfg.UI);
            this._autor = cfg.autor;
            this._titulo = cfg.titulo;
            this._canal_libro = cfg.canalLibro;
            this.start();
        };
    
        NodoVistaDeLibroEnBuscador.prototype = {
            start: function(){
                this._portal = new NodoPortalConCanal("vista libro en buscador", this._canal_libro);
                
                this._label_autor = this._ui.find('#autor_de_libro_encontrado');
                this._label_titulo = this._ui.find('#titulo_de_libro_encontrado');
                
                this._label_autor.text(this._autor);
                this._label_titulo.text(this._titulo);
                
                this._portal.pedirMensajes(new FiltroXClaveValor("tipoDeMensaje", "vortexComm.biblioteca.libroActualizado"),
                                           this.actualizar.bind(this));
            },  
            actualizar: function(libro){
                this._label_autor.text(libro.autor);
                this._label_titulo.text(libro.titulo); 
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
                if(!(obj instanceof NodoVistaDeEdicionDeLibro)) return false;
                return this._canal_libro.equals(obj._canal_libro);
            }
        };
    }
};

