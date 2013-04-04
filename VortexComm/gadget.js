var gadget = {
	options: {
		title				: 'Gadget Modelo',
		id					: null,
		UI					: null,
		app					: null
	},
	
	//constructor
	
	setOptions: function(options){
		$.extend(true, this.options, options);
	},
		
	start: function(options){
		this.gadget(options);
	},
	gadget: function(options){
		
		$.extend(true, this.options, options);
		
		
		var self = this;
		
		
		if(self.options.UI != null){
		
			self.options.UI.attr('id', self.options.id)
					.disableSelection()
					.draggable({
						handle: '.toolbar',
						snap: '.gadget',
						//grid: [ 10,10 ],
						cursor: "move",
						stack: ".gadget"
					})
					.resizable();
			
			
			
			//si quiero hacerla visible para afuera va con self. si no no.
			self.toolbar = 	self.options.UI.find('.toolbar')
								.text(self.options.title);
			
			
			
			self.contenedor = self.options.UI.find('.contenedor');
		}
		
	},
	mostrar: function(){
		this.options.UI.show();
	},
	
	ocultar: function(){
		this.options.UI.hide();
	},
	//despues veo si queda
    dibujarEn: function(panel){
        panel.append(this.options.UI);
    },
	//////
	
	
    agregarContenido: function(obj){
		
		this.options.app = obj;
		
		this.contenedor.append(obj.options.UI);
		
    }
}