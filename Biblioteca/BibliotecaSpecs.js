var test = {}

test.describe_1 = function(){
    describe("Creo un nodo biblioteca y un nodo buscador de libros conectados a un router.", function() { 
        beforeEach(function() {
            runs(function() { 
                test.plantilla_libro_encontrado = $("<li>");
                test.plantilla_libro_encontrado.append($("<div id='autor_de_libro_encontrado'>"));
                test.plantilla_libro_encontrado.append($("<div id='titulo_de_libro_encontrado'>"));
                
                test.plantilla_buscador = $("<div id='plantilla_buscador_de_libros'>");
                test.plantilla_buscador.append($("<div id='input_de_busqueda_del_buscador_de_libros'>"));
                test.plantilla_buscador.append($("<ul id='lista_de_libros_encontrados_del_buscador_de_libros'>"));
                
                test.un_router = new NodoRouter("1");  
                test.nodo_biblioteca = new NodoBiblioteca();
                test.nodo_buscador = new NodoBuscadorDeLibros({ UI:test.plantilla_buscador.clone(), 
                                                                plantilla_libro:test.plantilla_libro_encontrado});
                
                test.un_router.conectarBidireccionalmenteCon(test.nodo_biblioteca);
                test.un_router.conectarBidireccionalmenteCon(test.nodo_buscador);      
            }); 
            waits(100);
        });
        
        describe("Agrego el libro walden 2 a la biblioteca", function() { 
            test.describe_1_1();
        });
    });
};

test.describe_1_1 = function(){
    beforeEach(function() { 
        runs(function() { 
            test.nodo_biblioteca.onMensajeAgregarLibroRecibido({autor:"Skinner", titulo:"Walden 2"});
        }); 
        waits(100);        
    });  
    ///////////
    describe("El buscador pide libros de skinner'", function() { 
        test.describe_1_1_1();
    });
};

test.describe_1_1_1 = function(){
    beforeEach(function() { 
        runs(function() { 
            test.nodo_buscador.pedirLibrosPorAutor("Skinner");
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