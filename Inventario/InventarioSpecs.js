var test = {};

test.describe_1 = function () {
    describe("Creo un nodo inventario y un nodo administrador de cosas conectados a un router.", function () {
        beforeEach(function () {
            runs(function () {
                test.plantilla_cosa_encontrada = $("<div>");
                test.plantilla_cosa_encontrada.append($("<div id='nombre'>"));
                test.plantilla_cosa_encontrada.append($("<div id='descripcion'>"));
                
                test.plantilla_administrador_de_cosas = $("<div id='plantilla_administrador_de_cosas'>");
                test.plantilla_administrador_de_cosas.append($("<input id='input_nombre_en_alta'>"));
                test.plantilla_administrador_de_cosas.append($("<input id='input_descripcion_en_alta'>"));
                test.plantilla_administrador_de_cosas.append($("<button id='boton_agregar_en_alta'>"));
                test.plantilla_administrador_de_cosas.append($("<input id='input_de_busqueda'>"));
                test.plantilla_administrador_de_cosas.append($("<ul id='panel_lista_de_cosas_encontradas'>"));
                test.ui_administrador = test.plantilla_administrador_de_cosas.clone();
                
                test.un_router = new NodoRouter("1");
                test.canal_control = new Canal("MiInventario",
                                               new FiltroXClaveValor("Inventario", "1"),
                                               new TrafoXClaveValor("Inventario", "1"));
                test.canal_busquedas = new Canal("Haciendo",
                                               new FiltroXClaveValor("Canal", "Haciendo"),
                                               new TrafoXClaveValor("Canal", "Haciendo"));
                
                test.nodo_inventario = new NodoInventario({canalControl: test.canal_control,
                                                          canalBusquedas: test.canal_busquedas});
                test.nodo_administrador_de_cosas = new NodoAdministradorDeCosas({ UI: test.ui_administrador,
                                                                plantillaCosaEncontrada: test.plantilla_cosa_encontrada,
                                                                canalControl: test.canal_control,
                                                                canalBusquedas: test.canal_busquedas});
            
                test.un_router.conectarBidireccionalmenteCon(test.nodo_inventario);
                test.un_router.conectarBidireccionalmenteCon(test.nodo_administrador_de_cosas);
            });
            waits(250);
        });
        
        describe("Agrego un martillo al inventario desde el administrador de cosas", function () {
            test.describe_1_1();
        });
    });
};

test.describe_1_1 = function () {
    beforeEach(function () {
        runs(function () {
            test.input_nombre_en_alta = test.ui_administrador.find("#input_nombre_en_alta");
            test.input_descripcion_en_alta = test.ui_administrador.find("#input_descripcion_en_alta");
            test.boton_agregar_en_alta = test.ui_administrador.find("#boton_agregar_en_alta");
            
            test.input_nombre_en_alta.val("Martillo");
            test.input_descripcion_en_alta.val("Un martillo viejo");
            test.boton_agregar_en_alta.click();
        });
        waits(200);
    });
    it("El inventario deberia tener una cosa", function () {
        runs(function () {
            expect(test.nodo_inventario.cosas().Count()).toEqual(1);
        });
    });
    
    ///////////
//*   
    describe("El administrador pide martillos'", function () {
        test.describe_1_1_1();
    });
//*/
};

test.describe_1_1_1 = function () {
    beforeEach(function () {
        runs(function () {
            test.input_de_busqueda = test.ui_administrador.find("#input_de_busqueda");
            test.input_de_busqueda.val("martillo");
            test.input_de_busqueda.change();
        });
        waits(100);
    });

    it("El buscador deberia haber encontrado el martillo", function () {
        runs(function () {
            expect(test.nodo_administrador_de_cosas.cosasEncontradas().Count()).toEqual(1);
        });
    });
};
test.describe_1();