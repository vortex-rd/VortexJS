var chat = {
	//documenta intereface de options, y puede tener valores default
	options: {
		UI			: null,
		conjunto	: null,
		persistidor	: null,
		contexto	: null
	},
	///////
	
	
	
	
	//constructor
	start: function(options){
		
		
		
		var self = this;
		self.chat(options);
	},
	
	
	chat: function(options){
		
		
		
		var self = this;
		
		$.extend(true, self.options, options);
		
		//contructor del padre
		//self.gadget(options);
		
		
		
		
		
		
		self.conjuntoMensajeDeChat = self.options.conjunto.getSubConjunto();
		self.conjuntoMensajeDeChat.agregarFiltroEntrada(new FiltroXClaveValor("tipoDeMensaje", "MensajeDeChat"));
		self.conjuntoMensajeDeChat.agregarTrafoSalida(new TrafoXClaveValor("tipoDeMensaje", "MensajeDeChat"));
		self.conjuntoMensajeDeChat.pedirMensajes(function (mensaje){
				self.recibirMensaje(mensaje);
		});
		
		
		self.txtMensaje = self.options.UI.find('.txtMensaje');
		
		self.contenedorMensajes = self.options.UI.find('.contenedorMensajes');
		
		
		self.txtMensaje.keyup(function (e){
			self.eventoKeyUp(e);
		});
		
		
		self.ajustarAltoContenedorMensajes();
		self.txtMensaje.focus();
		
		
		
		self.usuarios.push(options.contexto.getParametro('NombreDeUsuario'));
		
		
	},
	//constructor:fin
	
	
	usuarios: new Array(),
	
	recibirMensaje: function(mensaje){
		
		
		console.log("mensaje", mensaje);
		
		
		var self = this;
		
		
		var persistidorMensaje = self.options.persistidor.getSubPersistidor();
		persistidorMensaje.setValor("mensaje", mensaje);
		
		var $divMensaje = self.options.UI.find("#plantilla_chat_mensaje").clone();
		$divMensaje.removeAttr('id');
		$divMensaje.show();
		
		$divMensaje.find('span').html(function (){
		
			//fomatearTexto
			var texto = mensaje.texto;
			texto = texto.replace(/\r\n|\r|\n/gi,"<br />");
			texto = texto.replace(/(ftp|http|https|file):\/\/[\S]+(\b|$)/gim, '<a href="$&" class="my_link" target="_blank">$&</a>').replace(/([^\/])(www[\S]+(\b|$))/gim, '$1<a href="http://$2" class="my_link" target="_blank">$2</a>');
			return texto;
			
		});
		
		
		var $contenedorMensajes = self.contenedorMensajes;
		
		var $divBloque;

		if (mensaje.usuario != self.ultUsuario) {
			
			
			$divBloque = self.options.UI.find("#plantilla_chat_bloque").clone();
			$divBloque.removeAttr('id');
			$divBloque.show();
			
			$divBloque.find('div.usuario').html(mensaje.usuario + ':');
			
			self.ultUsuario = mensaje.usuario;
			
			
			var idUsuario=-1;
			
			
			//busco el usuario en el array
			for (var i = 0; self.usuarios[i]; i++) {
				if (self.usuarios[i] == mensaje.usuario) {
					idUsuario=i;
					break;
				}
			}

			if (idUsuario == -1) {
				self.usuarios.push(mensaje.usuario);
				idUsuario = self.usuarios.length - 1;
			}



			$divBloque.addClass("usuario" + idUsuario);
			
			
			$contenedorMensajes.append($divBloque);
			
			
		} else {
			$divBloque = $contenedorMensajes.find('.bloque:last');
		}


		$divBloque.append($divMensaje);
		
		
		
		
		
		
		if (window.webkitNotifications.checkPermission() == 0) {
			if(mensaje.usuario!="Yo"){
				window.webkitNotifications.createNotification('', mensaje.usuario, mensaje.texto).show();
			}
		}
	},
	
	scrollearContenedorMensajes: function(){
		
		var self = this;
		self.contenedorMensajes.animate({ scrollTop: self.contenedorMensajes.prop("scrollHeight") }, 'fast');
	},
	
	ajustarAltoContenedorMensajes: function(){
		var self = this;
		var _bottom;
		_bottom = '';
		
		_bottom+= self.contenedorMensajes.parent().height();
		_bottom-= self.txtMensaje.position().top;
		self.contenedorMensajes.css('bottom', _bottom);
	},
	resetTxtMensaje: function(){
		var self = this;
		self.txtMensaje.val('');
		self.txtMensaje.attr('rows', 1);
		self.txtMensaje.height(20);
	},
	
	eventoKeyUp: function(e){
		if (window.event) e = window.event; 
		
		var self = this;
		
		//var sender = e.srcElement? e.srcElement : e.target; 

		var $txtMensaje = self.txtMensaje;
		var $contenedorMensajes = self.contenedorMensajes;
		
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13){
			
			if (!e.shiftKey) {
				e.preventDefault();
				
				
				
				var mensaje = {					
					"texto"			: $txtMensaje.val(),
					"usuario"		: self.options.contexto.getParametro('NombreDeUsuario'),					
					"aplicacion"	: "net.gaia.vortex.chat"
				}				
				
				self.conjuntoMensajeDeChat.recibirMensaje(mensaje);
				
				//Así veo el mio
				var mensajeYo =  $.extend({}, mensaje);
				mensajeYo.usuario="Yo";
				self.recibirMensaje(mensajeYo);
				//
				
				
				self.resetTxtMensaje();
				self.ajustarAltoContenedorMensajes();
				
				return false;
			}
			
		}
		
		
		//ajustarTxtMensaje
		var max = 100;
		/* Default max height */
		var max = (typeof max == 'undefined') ? 1000 : max;
		/* Don't let it grow over the max height */
		if ($txtMensaje.prop("scrollHeight") > max) {
			/* Add the scrollbar back and bail */
			if ($txtMensaje.css('overflowY') != 'scroll') { $txtMensaje.css('overflowY', 'scroll') }
			return;
		}
		/* Make sure element does not have scroll bar to prevent jumpy-ness */
		if ($txtMensaje.css('overflowY') != 'hidden') { $txtMensaje.css('overflowY', 'hidden') }
		/* Now adjust the height */
		var scrollH = $txtMensaje.prop("scrollHeight") - 2;
		if (scrollH > $txtMensaje.height()) {
			scrollH+= 1.0 * parseInt($txtMensaje.css("borderLeftWidth"), 10);
			$txtMensaje.height(scrollH);
		}
		
		
		self.ajustarAltoContenedorMensajes();
		
		self.scrollearContenedorMensajes();
			
	}
	
};
//chat = $.extend(true,{}, gadget, chat);
