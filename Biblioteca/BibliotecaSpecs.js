var test = {}

test.describe_1 = function(){
    describe("Creo un nodo biblioteca, un nodo vista de biblioteca y un nodo buscador de libros conectados a un router.", function() { 
        beforeEach(function() {
            runs(function() { 
                $.globalEval(libreriaBuscadorDelibros.script());
                test.plantilla_libro_encontrado = $("<li>");
                test.plantilla_libro_encontrado.append($("<div id='autor_de_libro_encontrado'>"));
                test.plantilla_libro_encontrado.append($("<div id='titulo_de_libro_encontrado'>"));
                
                test.plantilla_buscador = $("<div id='plantilla_buscador_de_libros'>");
                test.plantilla_buscador.append($("<input id='input_de_busqueda_del_buscador_de_libros'>"));
                test.plantilla_buscador.append($("<ul id='lista_de_libros_encontrados_del_buscador_de_libros'>"));
                test.ui_buscador = test.plantilla_buscador.clone();
                
                test.plantilla_vista = $("<div id='plantilla_biblioteca'>");
                test.plantilla_vista.append($("<input id='input_nombre_autor_del_alta_de_libros'>"));
                test.plantilla_vista.append($("<input id='input_titulo_del_alta_de_libros'>"));
                test.plantilla_vista.append($("<button id='boton_agregar_del_alta_de_libros'>"));
                test.plantilla_vista.append($("<button id='boton_refrescar_del_alta_de_libros'>"));
                test.plantilla_vista.append($("<ul id='panel_libros_en_vista_de_libros'>"));
                test.ui_vista = test.plantilla_vista.clone();
                
                test.un_router = new NodoRouter("1");  
                test.canal_control = new Canal("MiBiblioteca", 
                                               new FiltroXClaveValor("Biblioteca", "1") , 
                                               new TrafoXClaveValor("Biblioteca", "1"));
                test.canal_busquedas = new Canal("Haciendo", 
                                               new FiltroXClaveValor("Canal", "Haciendo") , 
                                               new TrafoXClaveValor("Canal", "Haciendo"));
                
                test.nodo_biblioteca = new NodoBiblioteca({canalControl: test.canal_control,
                                                          canalBusquedas: test.canal_busquedas});
                test.nodo_buscador = new NodoBuscadorDeLibros({ UI:test.ui_buscador, 
                                                                plantilla_libro:test.plantilla_libro_encontrado,
                                                                canalBusquedas: test.canal_busquedas});
                
                test.nodo_vista_biblioteca = new NodoVistaDeBiblioteca({    UI:test.ui_vista , 
                                                                            plantilla_libro:test.plantilla_libro_encontrado,
                                                                            canalControl: test.canal_control});
                
                test.un_router.conectarBidireccionalmenteCon(test.nodo_biblioteca);
                test.un_router.conectarBidireccionalmenteCon(test.nodo_vista_biblioteca);
                test.un_router.conectarBidireccionalmenteCon(test.nodo_buscador);      
            }); 
            waits(250);
        });
        
        describe("Agrego el libro walden 2 a la biblioteca", function() { 
            test.describe_1_1();
        });
    });
};

test.describe_1_1 = function(){
    beforeEach(function() { 
        runs(function() { 
            test.input_nombre_autor_del_alta_de_libros = test.ui_vista.find("#input_nombre_autor_del_alta_de_libros");
            test.input_titulo_del_alta_de_libros = test.ui_vista.find("#input_titulo_del_alta_de_libros");
            test.boton_agregar_del_alta_de_libros = test.ui_vista.find("#boton_agregar_del_alta_de_libros");
            
            test.input_nombre_autor_del_alta_de_libros.val("Skinner");
            test.input_titulo_del_alta_de_libros.val("Walden 2");
            test.boton_agregar_del_alta_de_libros.click();
        }); 
        waits(200);        
    });  
    it("La biblioteca deberia tener un libro", function() {
        runs(function() { 
            expect(test.nodo_biblioteca.libros().Count()).toEqual(1); 
        });
    });
    
    ///////////
    describe("El buscador pide libros de skinner'", function() { 
        test.describe_1_1_1();
    });
};

test.describe_1_1_1 = function(){
    beforeEach(function() { 
        runs(function() { 
            test.input_de_busqueda_del_buscador_de_libros = test.ui_buscador.find("#input_de_busqueda_del_buscador_de_libros");            
            test.input_de_busqueda_del_buscador_de_libros.val("Skinner");
            test.input_de_busqueda_del_buscador_de_libros.change();
        });  
        waits(100);
    });  

    it("El buscador deberia haber encontrado el libro", function() {
        runs(function() { 
            expect(test.nodo_buscador.librosEncontrados().Count()).toEqual(1); 
        });
    });
};
test.describe_1();