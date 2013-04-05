var vortexComm = {
	
	portalComun:	null,
	clienteHTTP: 	null,
	conjunto:		null,
	persistidor:	null,
	nombreUsuario:	null,
	
	
};




$(function () {
	
	
	var portalComun = new NodoPortalBidi();
	var clienteHTTP = new NodoClienteHTTP('http://kfgodel.info:62626/vortex');
	//var clienteHTTP = new NodoClienteHTTP('http://192.168.1.130:62626/vortex');
	portalComun.conectarCon(clienteHTTP);
	clienteHTTP.conectarCon(portalComun);
	
	
	
	// 1 seteo filtros en conjunto
	var conjunto = new ConjuntoVortex(portalComun);
	conjunto.agregarFiltroEntrada(new FiltroXClaveValor('aplicacion', 'VortexComm'));	
	conjunto.agregarTrafoSalida(new TrafoXClaveValor('aplicacion', 'VortexComm'));
	
	
	// 2 traigo del persistidor los datos
	var persistidor = new Persistidor($('#persistencia'));
	var nombreUsuario = persistidor.getValor('NombreDeUsuario');
	
	if(nombreUsuario=='') {
		nombreUsuario = 'usuario' + getIdObjeto();
		persistidor.setValor('NombreDeUsuario', nombreUsuario);
	}	
	
	
	
	
	
	// 3 seteo parametros en contexto
	var contexto = new ContextoVortex(new ContextoNulo());
	contexto.setParametro('NombreDeUsuario', nombreUsuario);
	
	
	
	
	
	
	//*********** controlUsuario
	var controlUsuario = $("#control_usuario");
	editTextControl(controlUsuario, false);
	controlUsuario.find('input').val(nombreUsuario);
	
	
	
	
	controlUsuario.on("dblclick", function (e) {
		e.stopPropagation();
		editTextControl(this, true);
		
	});
	
	
	controlUsuario.on("keypress", function(e) {
		
		if(e.which == 13) {
			e.stopPropagation();
			nombreUsuario = controlUsuario.find('input').val();
			
			persistidor.setValor('NombreDeUsuario', nombreUsuario);	
			contexto.setParametro('NombreDeUsuario', nombreUsuario);
			
			editTextControl(this, false);
		}
		
	});
	
	//TO DO nombre horrible y confuso
	var persistidorCanales = persistidor.getSubPersistidor("canales");
	var persistidoresCanales = persistidorCanales.getSubPersistidores();
	
	var listaCanales = [];
	
	var administradorCanales = $('#administrador_canales');
	
	$.each(persistidoresCanales, function (clave, persistidorCanal) {
		
		
		var un_canal = $.extend(true,{}, canal);
		
		un_canal.start({
			persistidor		: persistidorCanal, 
			conjunto		: conjunto.getSubConjunto(), 
			contexto		: contexto.getSubContexto(),
			
			UI				: $('#plantilla_canal').clone(),
			
			panelGadgets	: $('#panel_gadgets')
			
		});
		
		//TO DO ver de juntar
		listaCanales.push(un_canal);
		administradorCanales.append(un_canal.options.UI);
		
	});
	
	
	//*********** botonAddCanal
	var botonAddCanal = $('#administrador_canales_boton_add_canal');
	
	botonAddCanal.on("click", function (){
		var idCanal = "Canal" + (listaCanales.length + 1).toString();
		
		var persistidorCanal = persistidorCanales.getSubPersistidor(idCanal);
		persistidorCanal.setValor("idCanal", idCanal);
		persistidorCanal.setValor("descripcion", idCanal);
		
		
		
		var un_canal = $.extend(true,{}, canal);
		
		
		un_canal.start({
			persistidor		: persistidorCanal, 
			conjunto		: conjunto.getSubConjunto(), 
			contexto		: contexto.getSubContexto(),
			
			UI				: $('#plantilla_canal').clone(),
			
			panelGadgets	: $('#panel_gadgets')
			
		});
		
		
		//TO DO ver de juntar
		listaCanales.push(un_canal);
		administradorCanales.append(un_canal.options.UI);	
		
		
	});
	
	
	
	
	
	
	


	
	
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
	
	
	
});



//funciones genericas (a acomodar)
var editTextControl = function(textControl, flagEdit){
	
	var $input = $(textControl).find('input');
	
	if(flagEdit==true){
		$input.removeAttr('readonly');
		
		$input.addClass('editable');
		
	}else{
		$input.attr('readonly', true);
		$input.removeClass('editable');
	}
	
	
};

var desSeleccionarTodosLosCanales = function(){
	//cambiar children por .find
	//vortexComm.panelCanales.children().removeClass("control_canal_seleccionado");
	$('#administrador_canales').find('.control_canal').removeClass("control_canal_seleccionado");
};
	
var canal = {
	options: {
		UI				: null,
		conjunto		: null,
		persistidor		: null,
		contexto		: null,
		
		
		panelGadgets	: null,
		idCanal			: null,
		descripcion		: null
	},
	
	
	//constructor
	
	setOptions: function(options){
		$.extend(true, this.options, options);
	},
		
	start: function(options){
		this.canal(options);
	},
	
	gadgets: [],
	
	canal: function(options) {
		
		var self = this;
		
		$.extend(true, self.options, options);
		
		
		//Routing
		self.filtroCanal = new FiltroXClaveValor("canal", self.options.idCanal);
		self.trafoCanal = new TrafoXClaveValor("canal", self.options.idCanal);
		
		self.conjuntoCanal = self.options.conjunto;
		self.conjuntoCanal.agregarFiltroEntrada(self.filtroCanal);
		self.conjuntoCanal.agregarTrafoSalida(self.trafoCanal);
		
		
		
		
		//recepcion de mensajes
		//self.conjuntoCanal.pedirMensajes( function (mensaje) {
		//	self.recibirMensaje(mensaje);
		//});
		
		
		//Persistencia
		var contexto = options.contexto;
		var conjunto = options.conjunto;
		
		
		
		if(self.options.idCanal == null){
			
			
			self.options.idCanal = self.options.persistidor.getValor("idCanal");
			self.options.descripcion = self.options.persistidor.getValor("descripcion");
			
		}else{
			self.options.persistidor.setValor("idCanal", self.options.idCanal);
			self.options.persistidor.setValor("descripcion", self.options.descripcion);
		}
		
				
		
		
		var persistidorGadgets = self.options.persistidor.getSubPersistidor("gadgets");			
		
		
		//contexto (parametros)
		contexto.setParametro('idCanal', self.options.idCanal);
		
		//UI
		self.controlCanal = $(self.options.UI);
		
		self.controlCanal.find('input').val(self.options.idCanal);
		
		
		self.controlCanal.attr('id', self.options.idCanal);
		
		
		var panelGadgets = $('#panel_gadgets');
		
		
		editTextControl(self.controlCanal, false);
		
		
		self.controlCanal.on("click", function (e) {
			e.stopPropagation();
			
			//TO DO hacerlo de forma que se ejecute el ocultar de los gadgets
			self.options.panelGadgets.children().hide();
			
			self.gadgets.forEach(function (gadget, index) {
				gadget.mostrar();
			});
			
			
			desSeleccionarTodosLosCanales();
			self.controlCanal.addClass("control_canal_seleccionado");
		});
		
		self.controlCanal.on("dblclick", function (e) {
			e.stopPropagation();
			
			
			
			
			editTextControl($(this), true);
			
		});
		
		self.controlCanal.keypress(function(e) {
			if(e.which == 13) {
				e.stopPropagation();
				
				idCanal = $(this).find('input').val();
				
				self.options.persistidor.setValor("idCanal", idCanal);
				self.options.persistidor.setValor("descripcion", idCanal);
				
				self.filtroCanal.valor = idCanal;
				self.trafoCanal.valor = idCanal;
				
				
				
				editTextControl($(this), false);
			}
		});
		
		
		
		
		/********************* GADGETs **************************/
		
		
		
		/*
		var gKanbanBoard = new KanbanBoard({	id:"kb" + idCanal,
												portal:portal, 
												persistidor:persistidorGadgets.getSubPersistidor("kb" + idCanal), 
												contexto:contexto.getSubContexto(),
												conjunto:conjunto.getSubConjunto()
											});
		self.gadgets.push(gKanbanBoard);
		
		*/
		
		
		var plantillas = $('#plantillas');
		var unGadget;
		
		
		
		unGadget = $.extend(true,{}, gadget);
		unGadget.start({
			title			: 'Chat',
			id				: "chat" + self.options.idCanal,
			UI				: plantillas.find("#plantilla_gadget").clone()
		});
		
		
		var unChat = $.extend(true,{}, chat);
		
		unChat.start({
			
			contexto		: contexto.getSubContexto(),
			persistidor		: persistidorGadgets.getSubPersistidor("chat" + self.options.idCanal),
			conjunto		: conjunto.getSubConjunto(),
			
			UI 				: plantillas.find("#plantilla_chat").clone()
		});
		
		unGadget.agregarContenido(unChat);
		
		self.gadgets.push(unGadget);
		
		
		
		
		
		
		
		unGadget = $.extend(true,{}, gadget);
		unGadget.start({
			title			: 'Pizarra',
			id				: "pizarra" + idCanal,
			
			UI				: plantillas.find("#plantilla_gadget").clone()
		});
		
		var unaPizarra = $.extend(true,{}, pizarra);
		
		unaPizarra.start({
			contexto		: contexto.getSubContexto(),
			persistidor		: persistidorGadgets.getSubPersistidor("pizarra" + self.options.idCanal),
			conjunto		: conjunto.getSubConjunto(),
			
			UI 				: plantillas.find("#plantilla_pizarra").clone()
		});
		
		unGadget.agregarContenido(unaPizarra);
		self.gadgets.push(unGadget);
		
		
		/********************* FIN: GADGETs **************************/
		
		
		
		self.gadgets.forEach(function (gadget, index){
			//agregar a los gadgets
			gadget.dibujarEn(self.options.panelGadgets);
			gadget.ocultar();
			
		});
		
	}
	
	
};
