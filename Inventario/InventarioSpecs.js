var test = {};

test.describe_1 = function () {
    describe("Creo un nodo inventario y un nodo alta de cosas conectados a un router.", function () {
        beforeEach(function () {
            runs(function () {                
                test.plantilla_alta_de_cosas = $("<div id='plantilla_alta_de_cosas'>");
                test.plantilla_alta_de_cosas.append($("<input id='input_nombre'>"));
                test.plantilla_alta_de_cosas.append($("<input id='input_descripcion'>"));
                test.plantilla_alta_de_cosas.append($("<button id='boton_agregar'>"));
                test.plantilla_alta_de_cosas.append($("<input id='estado_alta'>"));
                test.ui_alta = test.plantilla_alta_de_cosas.clone();
                
                test.un_router = new NodoRouter("1");
                test.canal_control = new Canal("MiInventario",
                                               new FiltroXClaveValor("Inventario", "1"),
                                               new TrafoXClaveValor("Inventario", "1"));
                test.canal_busquedas = new Canal("Haciendo",
                                               new FiltroXClaveValor("Canal", "Haciendo"),
                                               new TrafoXClaveValor("Canal", "Haciendo"));
                
                test.nodo_inventario = new NodoInventario({canalControl: test.canal_control,
                                                          canalBusquedas: test.canal_busquedas});
                test.nodo_alta = new NodoAltaDeCosa({   ui: test.ui_alta,
                                                        canalControl: test.canal_control});
            
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