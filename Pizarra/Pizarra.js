var pizarra = {
	options: {
		UI			: null,
		conjunto	: null,
		persistidor	: null,
		contexto	: null
	},
	
	dibujarEn: function(panel){
        panel.append(this.options.UI);
    },
	
	
	//constructor
	start: function(options){
		
		
		var self = this;
		self.pizarra(options);
	},
	
	
	pizarra: function(options){
		
		var self = this;
		
		$.extend(true, self.options, options);
		
		
		
		
		//contructor del padre
		//self.gadget(options);
		//contructor del padre:fin
		
		
		self.conjuntoPizarra = self.options.conjunto.getSubConjunto();
		self.conjuntoPizarra.agregarFiltroEntrada(new FiltroXClaveValor("tipoDeMensaje", "MensajeDePizarra"));
		self.conjuntoPizarra.agregarTrafoSalida(new TrafoXClaveValor("tipoDeMensaje", "MensajeDePizarra"));

		self.conjuntoPizarra.pedirMensajes( function (mensaje) {
			self.recibirMensaje(mensaje);
		});
		
		self.canvas = self.options.UI.find('canvas');
		
		self.canvas.context = self.canvas[0].getContext('2d');

		
		
		// bind click events on the toolbar button to the canvas_mousemove method
		self.canvas.mousedown(function(e){
			self.canvas_mousedown(e);
		});
		self.canvas.mousemove(function(e){
			self.canvas_mousemove(e);
		});
		self.canvas.mouseup(function(e){
			self.canvas_mouseup(e);
		});
		self.canvas.mouseleave(function(e){
			self.canvas_mouseup(e);
		});
		
		
		
	},
	//constructor:fin
	
	
	usuarios: new Array(),
	
	recibirMensaje: function(mensaje){
	
		var self = this;
		
		self.canvas.context.moveTo(mensaje.puntos[0].posX, mensaje.puntos[0].posY);
		self.canvas.context.beginPath();
		
		for(var i = 1; mensaje.puntos[i]; i++) {
			
			self.canvas.context.lineTo(mensaje.puntos[i].posX, mensaje.puntos[i].posY);
			self.canvas.context.stroke();
			
		}
		
		
	},
	
	
	canvas_mousedown: function( e ) {
		
		var self = this;
		
		self.canvas.context.moveTo(e.offsetX, e.offsetY);
		self.canvas.context.beginPath();
		
		self.puntos = new Array();
		self.puntos[0] = {
			posX: e.offsetX,
			posY: e.offsetY
		};
		
		
		self.flagMouseDown = 1;
		
	},
	
	
	canvas_mousemove: function( e ) {
		
		var self = this;
		
		if(self.flagMouseDown == 1){
			
			self.canvas.context.lineTo(e.offsetX, e.offsetY);
			self.canvas.context.stroke();
			
			self.puntos.push({
				posX: e.offsetX,
				posY: e.offsetY
			});
		
		}
		
	},
	
	canvas_mouseup: function( e ) {
		
		var self = this;
		
		if(self.flagMouseDown == 1){
			
			var mensaje = {
				"puntos"			: self.puntos,
				"usuario"			: self.options.contexto.getParametro('NombreDeUsuario'),
				"aplicacion"		: "net.gaia.vortex.pizarra"
			}				
			
			self.conjuntoPizarra.recibirMensaje(mensaje);
			
			self.puntos = [];
			
			self.flagMouseDown = 0;

		}
		
	}
	
	
};
//pizarra = $.extend(true,{}, gadget, pizarra);

