$(function () {
	
	var portalComun = new NodoPortalBidi();
	var clienteHTTP = new NodoClienteHTTP('http://kfgodel.info:62626/vortex');
	//var clienteHTTP = new NodoClienteHTTP('http://192.168.1.130:62626/vortex');
	portalComun.conectarCon(clienteHTTP);
	clienteHTTP.conectarCon(portalComun);
	
	var pers = new Persistidor($('#persistencia'));
	var ctx = new ContextoVortex(new ContextoNulo());
	var conjunto = new ConjuntoVortex(portalComun);
	
	vxComm = new VortexComm({persistidor:pers, contexto:ctx, conjunto:conjunto});
	
	
	$('#hideBar').on('click', function(){
		
		var timepoHide = 300;
		
		$('#administrador').animate(
			{width:'toggle'},
			timepoHide
		);
		
		
		if($('#hideBar').position().left > 0){
		
			$('#hideBar').animate(
				{left:'0'},
				timepoHide
			);
			
		} else {
		
			$('#hideBar').animate(
				{left:'210'},
				timepoHide
			);
			
		}
	});
	
	
	
	
	
	/*
	$('#administrador_canales').accordion({
      collapsible: true
    });
	*/
	/*
	$("#panelPrincipal").empty();
	vxComm.appendTo("#panelPrincipal");
	*/
	
});


var VortexComm = {
	//documenta intereface de options, y puede tener valores default
	options: {
		conjunto	: null,
		persistidor	: null,
		contexto	: null,
		
		UI			: null
		
	},
	///////
	
	
	
	editValor: function($input, flagEdit){
		if(flagEdit==true){
			$input.removeAttr('readonly');
			$input.css("background-color", "black");
		}else{
			$input.attr('readonly', true);
			$input.css("background-color", "transparent");
		}
	},
	
	
	
	desSeleccionarTodosLosCanales = function(){
		//cambiar children por .find
		//vortexComm.panelCanales.children().removeClass("control_canal_seleccionado");
		vortexComm.administradorCanales.find('.control_canal').removeClass("control_canal_seleccionado");
	};
	
	VortexComm: function(options){
		
		self = this;
		
		$.extend(true, this.options, options);
		
		
		
		self.persistidor = self.options.persistidor;
		self.contexto = self.options.contexto;
		self.conjunto = self.options.conjunto;
		
		
		
		self.conjunto.agregarFiltroEntrada(new FiltroXClaveValor('aplicacion', 'VortexComm'));	
		self.conjunto.agregarTrafoSalida(new TrafoXClaveValor('aplicacion', 'VortexComm'));
		
		
		self.nombreUsuario = persistidor.getValor('NombreDeUsuario');
		
		if(self.nombreUsuario=='') {
			self.nombreUsuario = 'usuario' + getIdObjeto();
			self.persistidor.setValor('NombreDeUsuario', self.nombreUsuario);
		}	
		self.contexto.setParametro('NombreDeUsuario', self.nombreUsuario);
		
		
		self.controlUsuario = self.options.UI.find("#control_usuario");
		
		
		self.controlUsuario.edit = self.controlUsuario.find('.control_usuario_edit');
		self.controlUsuario.edit.val(nombreUsuario);
		
		
		
		self.editValor(self.controlUsuario.edit, false);
		
		
		self.controlUsuario.on("dblclick", function (e) {
			e.stopPropagation();
			self.editValor(self.controlUsuario, true);
		});
		
		
		self.controlUsuario.on("keypress", (function(e) {
			if(e.which == 13) {
				e.stopPropagation();
				nombreUsuario = self.controlUsuario.edit.val();
				
				persistidor.setValor('NombreDeUsuario', nombreUsuario);	
				self.contexto.setParametro('NombreDeUsuario', nombreUsuario);
				
				self.editValor(self.controlUsuario.edit, false);
			}
		});
		
		self.botonAddCanal = self.find('#administrador_canales_boton_add_canal');
		
		self.listaCanales = [];
		
		self.administradorCanales = self.find('#administrador_canales');
		
		self.panelGadgets = self.find('#panel_gadgets');
		
		
		self.persistidorCanales = self.persistidor.getSubPersistidor("canales");
		
		self.botonAddCanal.on("click", function (){
			
			var idCanal = "Canal" + (self.listaCanales.length + 1).toString();
			
			var persistidorCanal = self.persistidorCanales.getSubPersistidor(idCanal);			
			persistidorCanal.setValor("idCanal", idCanal);
			persistidorCanal.setValor("canal", idCanal);
			
			
			var nuevoCanal = $.extend(true,{}, canal);
			
			
			nuevoCanal.start({
				persistidor:	persistidorCanal, 
				conjunto:		self.conjunto.getSubConjunto(), 
				vortexComm:		self,
				contexto:		self.contexto.getSubContexto()
			});
			
			/*ver de juntar esto*/
			self.listaCanales.push(nuevoCanal);
			self.administradorCanales.append(nuevoCanal);
		});
		
		
		
		// vortexComm.resize(function(){
				// vortexComm.panelCanales.height(vortexComm.height()/2);
		// });
		//persistencia	
		var persistidoresCanales = persistidorCanales.getSubPersistidores();
		$.each(persistidoresCanales, function (clave, persistidorCanal) {
				var nuevoCanal = new Canal({persistidor:persistidorCanal, 
											conjunto:conjunto.getSubConjunto(), 
											vortexComm:vortexComm,
											contexto:contexto.getSubContexto()});
				vortexComm.listaCanales.push(nuevoCanal);
				
				vortexComm.administradorCanales.append(nuevoCanal);	
				
			});
		
		$.extend(true, this, vortexComm);
};




var Canal = function(config){
	var persistidor = config.persistidor;
	var portal = config.portal;
	var vortexComm = config.vortexComm;
	var contexto = config.contexto;
	var conjunto = config.conjunto;
	
	var idCanal = persistidor.getValor("idCanal");
	var canal = persistidor.getValor("canal");
	
	var controlCanal = $("#protoControlCanal")
					.clone()
					.attr('id', idCanal);
		
	contexto.setParametro('canal', canal);
	
	var filtroCanal = new FiltroXClaveValor("canal", canal);
	var trafoCanal = new TrafoXClaveValor("canal", canal);
	
	conjunto.agregarFiltroEntrada(filtroCanal);	
	conjunto.agregarTrafoSalida(trafoCanal);	
	
	
	controlCanal.edit = controlCanal.find('.control_canal_edit');
	
	
	controlCanal.edit.val(canal);
	
	
	
	controlCanal.edit.attr('readonly', true);
	controlCanal.edit.css("background-color", "transparent");
	
	
	controlCanal.gadgets = [];
	
	var persistidorGadgets = persistidor.getSubPersistidor("gadgets");			
	
	
	/********************* GADGETs **************************/
	
	
	
	/*
	var gKanbanBoard = new KanbanBoard({	id:"kb" + idCanal,
											portal:portal, 
											persistidor:persistidorGadgets.getSubPersistidor("kb" + idCanal), 
											contexto:contexto.getSubContexto(),
											conjunto:conjunto.getSubConjunto()
										});
	controlCanal.gadgets.push(gKanbanBoard);
	
	*/
	
	
	var plantillas = $('#plantillas');
	
	
	var unChat = $.extend(true,{}, chat);
	unChat.start({
		title			: 'Chat',
		id				: "chat" + idCanal,
		
		contexto		: contexto.getSubContexto(),
		persistidor		: persistidorGadgets.getSubPersistidor("chat" + idCanal),
		conjunto		: conjunto.getSubConjunto(),
		
		UI 				: plantillas.find("#plantilla_gadgetChat").clone()
	});
	
	
	controlCanal.gadgets.push(unChat);
	
	
	
	var unaPizarra = $.extend(true,{}, pizarra);
	unaPizarra.start({
		title			: 'Pizarra',
		id				: "pizarra" + idCanal,
		
		contexto		: contexto.getSubContexto(),
		persistidor		: persistidorGadgets.getSubPersistidor("pizarra" + idCanal),
		conjunto		: conjunto.getSubConjunto(),
		
		UI 				: plantillas.find("#plantilla_gadgetPizarra").clone()
	});
	
	controlCanal.gadgets.push(unaPizarra);
	
	
	
	
	/********************* FIN: GADGETs **************************/
	
	
	controlCanal.gadgets.forEach(function (gadget, index){
		
		vortexComm.panelGadgets.append(gadget.options.UI);
		gadget.ocultar();
		
	});
	
	controlCanal.on("click", function (e) {
		e.stopPropagation();
		
		vortexComm.panelGadgets.children().hide();
		
		controlCanal.gadgets.forEach(function (gadget, index) {
			gadget.mostrar();
		});
		
		
		
		vortexComm.desSeleccionarTodosLosCanales();
		controlCanal.addClass("control_canal_seleccionado");
    });
	
	controlCanal.on("dblclick", function (e) {
		e.stopPropagation();
		
		
		self.editValor(controlCanal.edit);
		
		controlCanal.edit.attr('readonly', false);
		controlCanal.edit.css("background-color", "white");
		
    });
	
	controlCanal.keypress(function(e) {
		var self = this;
		
		if(e.which == 13) {
			e.stopPropagation();
			
			canal = self.controlCanal.edit.val();
			
			self.persistidor.setValor("canal", canal);
			filtroCanal.valor = canal;
			trafoCanal.valor = canal; 	
			controlCanal.edit.attr('readonly', true);
			controlCanal.edit.css("background-color", "transparent");
		}
	});
	
	$.extend(true, this, controlCanal);	
};



