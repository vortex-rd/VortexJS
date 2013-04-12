var test = {}

test.describe_1 = function(){
    describe("Administrador de Librerias", function() {      
         beforeEach(function() {
            runs(function() { 
                test.plantilla_libro_encontrado = $("<li>");
                test.plantilla_libro_encontrado.append($("<div id='autor_de_libro_encontrado'>"));
                test.plantilla_libro_encontrado.append($("<div id='titulo_de_libro_encontrado'>"));
                
                test.plantilla_buscador = $("<div id='plantilla_buscador_de_libros'>");
                test.plantilla_buscador.append($("<input id='input_de_busqueda_del_buscador_de_libros'>"));
                test.plantilla_buscador.append($("<ul id='lista_de_libros_encontrados_del_buscador_de_libros'>"));
                test.ui_buscador = test.plantilla_buscador.clone();
            }); 
        });
        it("deberia poder registrar una libreria evaluando su script y despues poder instanciar clases", function() { 
            runs(function() { 
                $.globalEval(libreriaBuscadorDelibros.script());                
                var un_buscador = new NodoBuscadorDeLibros({ UI:test.ui_buscador, 
                                                                plantilla_libro:test.plantilla_libro_encontrado});
                expect(un_buscador).toBeDefined();
            });             
        });
        it("cuando pido una libreria el proveedor deberia enviarla y el administrador de librerias recibirla, asi puedo instanciar una clase", function() { 
            runs(function() { 
                test.idAdministrador = "admin_1";
                test.router = new NodoRouter("router principal");
                test.proveedorDeBuscadorDeLibros = new NodoProveedorDeLibreria({libreria:libreriaBuscadorDelibros});
                test.adminLibs = new NodoAdministradorDeLibrerias({idAdministrador:test.idAdministrador});
                
                test.router.conectarBidireccionalmenteCon(test.proveedorDeBuscadorDeLibros);
                test.router.conectarBidireccionalmenteCon(test.adminLibs);
            }); 
            waits(100);
            runs(function() { 
                test.router.recibirMensaje({tipoDeMensaje: "vortexComm.market.pedidoDeLibreria", 
                                nombre: "BuscadorDeLibros",
                                version: 0.1,
                                idSolicitante:test.idAdministrador});
            }); 
            waits(100);
            runs(function() { 
                var un_buscador = new NodoBuscadorDeLibros({ UI:test.ui_buscador, 
                                                                plantilla_libro:test.plantilla_libro_encontrado});
                expect(un_buscador).toBeDefined();
            }); 
            
        });
    });
};

test.describe_1();