var GadgetDePrueba = function(cfg){
    self = this;
    contenedor = $('<div>');
    contenedor.load('GadgetDePrueba.html');
    var unGadget=contenedor.find("#protoKanbanBoard");
    unGadget.attr("id", cfg.id);
    $.extend(true, this, unGadget);
}