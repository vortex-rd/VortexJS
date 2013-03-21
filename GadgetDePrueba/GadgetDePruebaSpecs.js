describe("Inventario", function() {  
    beforeEach(function() {
        router = new NodoRouter();
        spyOn(router, 'recibirMensaje').andCallThrough();        
    });
            
    describe("Una cosa y su representacion conectadas a la misma red", function() {   
        var cosa;
        var rep_cosa
        beforeEach(function() {
            cosa = new Cosa({router: router, nombre: 'una_cosa'});
            rep_cosa = new RepresentacionDeCosa({router: router, nombre: 'una_cosa'});
        });
        
        it("1 - Cuando la representacion le envía un comando de cambiar de nombre a la cosa, este debería cambiar correctamente", function() {

            waits(0);       
            waitsFor(function() {
                return router.conectadoBidireccionalmenteEnTodasSusPatas();
            }, "no se establecieron las conexiones bidi", 500);
            
            waits(0);       
            waitsFor(function() {
                return rep_cosa.hayUnaCosaConectada();
            }, "No se recibio el filtro de la cosa", 500);

            runs(function() {
                rep_cosa.nombre('una_cosa_loca');
            });
    
            waits(0);        
            waitsFor(function() {
                return cosa.nombre() == 'una_cosa_loca';
            }, "La cosa no cambio de nombre", 500);
        });
    });
 });       
  