var test = {}

test.describe_1 = function(){
    describe("Creo una biblioteca vacia conectada a la red vortex usando un controlador y tambien conecto a la red un buscador de libros con su controlador. Espero a que se establezca la conexion.", function() { 
        beforeEach(function() {
            runs(function() { 
                test.un_router = new NodoRouter();  
                test.nodo_biblioteca = new NodoBiblioteca(test.un_router);
                test.una_biblioteca = test.nodo_biblioteca._biblioteca;               
                test.un_buscador_de_libros = FabricaDeBuscadoresDeLibros.crearBuscadorConectadoALaRed(test.un_router);               
            }); 
           
            waits(0); 
            waitsFor(function() {
                        return  test.un_router.conectadoBidireccionalmenteEnTodasSusPatas();           
            }, "No se establecio la conexion", 500);  
        });
        
        describe("El buscador pide libros escritos por Skinner, y espero a que llegue el pedido", function() { 
            test.describe_1_1();
        });
    });
};

test.describe_1_1 = function(){
    beforeEach(function() { 
        runs(function() { 
            test.un_buscador_de_libros.pedirLibrosPorAutor("Skinner"); 
        });      
        waits(20);    
    });  
    ///////////
    describe("Creo el libro 'walden 2'", function() { 
        test.describe_1_1_1();
    });
};

test.describe_1_1_1 = function(){
    beforeEach(function() {
        runs(function() { 
            test.walden2 = new Libro({titulo: "Walden 2", autor: "Skinner"});  
        });
    });
    //<<<<<<<<<<tests
    it("El titulo del libro deberia ser 'walden 2'", function() {
        runs(function() { 
            expect(test.walden2.titulo()).toEqual("Walden 2");        
        });   
    }); 
    
    it("El autor del libro deberia ser Skinner", function() {
        expect(test.walden2.autor()).toEqual("Skinner");                
    }); 
    //tests>>>>>>>>>>
    describe("Lo agrego a la biblioteca", function() { 
       test.describe_1_1_1_1();
    });   
};

test.describe_1_1_1_1 = function(){
    beforeEach(function() {       
        runs(function() { 
            test.una_biblioteca.agregarLibro(test.walden2);
        });
    });
    
    //<<<<<<<<<<tests
    it("La biblioteca deberia tener un libro", function() {
        expect(test.una_biblioteca.libros().Count()).toEqual(1);                 
    });                           
    it("El buscador deberia haber encontrado un libro", function() {
        waits(0);        
        waitsFor(function() {
                return  test.un_buscador_de_libros.librosEncontrados().Count() == 1;           
        }, "No se encontro el libro", 500);       
    });  
    //tests>>>>>>>>>>
    
    describe("Conecto a la red otra biblioteca, luego espero a que se establezca la conexion y lleguen los filtros", function() { 
       test.describe_1_1_1_1_1();
    });  
    
    describe("Conecto a la red otro buscador, que pide libros de skinner", function() { 
       test.describe_1_1_1_1_2();
    });  
    
};
    
test.describe_1_1_1_1_1 = function(){
    beforeEach(function() {  
        runs(function() { 
            test.nodo_biblioteca_2 = new NodoBiblioteca(test.un_router);
            test.biblioteca_2 = test.nodo_biblioteca_2._biblioteca;     
        });
        waits(0); 
        waitsFor(function() {
            return  test.un_router.conectadoBidireccionalmenteEnTodasSusPatas();           
        }, "No se establecio la conexion", 500);  
        waits(100); 
    });
    describe("Le agrego 2 libros de skinner y uno de borges", function() { 
       test.describe_1_1_1_1_1_1();
    });  
};

test.describe_1_1_1_1_1_1 = function(){
    beforeEach(function() { 
        runs(function() { 
            test.libro_de_skinner_1 = new Libro({autor:'Skinner', titulo:'Pepe Grillo'});
            test.libro_de_skinner_2 = new Libro({autor:'Skinner', titulo:'Montoto'});
            test.libro_de_borges_1 = new Libro({autor:'Borges', titulo:'El Aleph'});
            
            test.biblioteca_2.agregarLibro(test.libro_de_skinner_1);
            test.biblioteca_2.agregarLibro(test.libro_de_skinner_2);
            test.biblioteca_2.agregarLibro(test.libro_de_borges_1);
        });
    });   
    it("El buscador deberia encontrar tres libros", function() {
        waits(100);        
        waitsFor(function() {
                return  test.un_buscador_de_libros.librosEncontrados().Count() == 3;           
        }, "No se encontraron los libros", 500);                 
    }); 
    describe("Conecto un segundo buscador a la red que, despues de establecerse la conexion pide libros de borges", function() { 
       test.describe_1_1_1_1_1_1_1();
    });
};

test.describe_1_1_1_1_1_1_1 = function(){
    beforeEach(function() { 
        runs(function() { 
            test.buscador_de_libros_2 = FabricaDeBuscadoresDeLibros.crearBuscadorConectadoALaRed(test.un_router); 
        });
                   
        waits(0); 
        waitsFor(function() {
            return  test.un_router.conectadoBidireccionalmenteEnTodasSusPatas();           
        }, "No se establecio la conexion", 500);          
        
        waits(100);    
        runs(function() { 
            test.buscador_de_libros_2.pedirLibrosPorAutor("Borges"); 
        });       
    });   
    
    it("El segundo buscador deberia haber encontrado un libro", function() {
        waits(50);        
        runs(function() {
            expect(test.buscador_de_libros_2.librosEncontrados().Count()).toEqual(1);           
        });                 
        
    }); 
    it("El primer buscador deberia haber encontrado tres libros (sin cambios)", function() {
        waits(50);        
        runs(function() {
            expect(test.un_buscador_de_libros.librosEncontrados().Count()).toEqual(3);           
        });                 
    });  
    
    describe("El segundo buscador pide libros de Skinner y el primer buscador pide libros de Borges", function() { 
       test.describe_1_1_1_1_1_1_1_1();
    });
};

test.describe_1_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {   
        waits(50);
        runs(function() { 
            test.buscador_de_libros_2.pedirLibrosPorAutor("Skinner"); 
        });
        waits(50);
        runs(function() { 
            test.un_buscador_de_libros.pedirLibrosPorAutor("Borges"); 
        });
        waits(50);  
    });   
    
    it("El segundo buscador deberia haber encontrado tres libros", function() {       
        runs(function() {
            expect(test.buscador_de_libros_2.librosEncontrados().Count()).toEqual(3);           
        });                 
        
    }); 
    it("El primer buscador deberia haber encontrado 1 libro", function() {      
        runs(function() {
            expect(test.un_buscador_de_libros.librosEncontrados().Count()).toEqual(1);           
        });                 
    }); 
};

test.describe_1_1_1_1_2 = function(){
    beforeEach(function() {  
        runs(function() { 
            test.buscador_de_libros_2 = FabricaDeBuscadoresDeLibros.crearBuscadorConectadoALaRed(test.un_router); 
        });
        waits(0); 
        waitsFor(function() {
            return  test.un_router.conectadoBidireccionalmenteEnTodasSusPatas();           
        }, "No se establecio la conexion", 500);        
        waits(10);    //esperio un tiempito extra a que llegue el filtro de la biblioteca al buscador
        runs(function() { 
            test.buscador_de_libros_2.pedirLibrosPorAutor("Skinner"); 
        });       
    });
    it("El segundo buscador deberia haber encontrado un libro", function() {
        waits(50);        
        runs(function() {
            expect(test.buscador_de_libros_2.librosEncontrados().Count()).toEqual(1);           
        });                 
    });  
};

test.describe_1();