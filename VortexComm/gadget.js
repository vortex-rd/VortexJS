
var gadget = {
	options: {
		title				: 'Gadget Modelo',
		id					: null,
		UI					: null
	},
	
	//constructor
	start: function(options){
		this.gadget(options);
	},
	gadget: function(options){
		
		$.extend(true, this.options, options);
		
		
		var $self = this;
		
		this.options.UI.attr('id', $self.options.id)
				.disableSelection()
				.draggable({
					handle: '.toolbar',
					snap: '.gadget',
					//grid: [ 10,10 ],
					cursor: "move",
					stack: ".gadget"
				})
				.resizable();
		
		
		
		//si quiero hacerla visible para afuera va con $self. si no no.
		this.toolbar = 	this.options.UI.find('.toolbar')
							.text($self.options.title);
		
		
		
		this.contenedor = this.options.UI.find('.contenedor');
		
	},
    dibujarEn: function(panel){
        panel.append(this.options.UI);
    },
    agregarContenido: function(objetoDibujable){
        objetoDibujable.dibujarEn(this.contenedor);
    }
}