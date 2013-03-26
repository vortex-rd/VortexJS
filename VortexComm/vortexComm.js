$(function () {
	
	

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
	
	
	
	
	
	//funciones genericas (a acomodar)
	var editTextControl = function($input, flagEdit){
		if(flagEdit==true){
			$input.removeAttr('readonly');
			$input.css("background-color", "black");
		}else{
			$input.attr('readonly', true);
			$input.css("background-color", "transparent");
		}
	};
	var desSeleccionarTodosLosCanales = function(){
		//cambiar children por .find
		//vortexComm.panelCanales.children().removeClass("control_canal_seleccionado");
		vortexComm.administradorCanales.find('.control_canal').removeClass("control_canal_seleccionado");
	};
	
	
	
	
	//*********** controlUsuario **
	var controlUsuario = $("#control_usuario");
	editTextControl(controlUsuario, false);
	
	controlUsuario.on("dblclick", function (e) {
	
		e.stopPropagation();
		editTextControl(controlUsuario, true);
		
	});
	
	controlUsuario.on("keypress", (function(e) {
	
		if(e.which == 13) {
			e.stopPropagation();
			nombreUsuario = controlUsuario.find('input').val();
			
			persistidor.setValor('NombreDeUsuario', nombreUsuario);	
			contexto.setParametro('NombreDeUsuario', nombreUsuario);
			
			editTextControl(self.controlUsuario.edit, false);
		}
	});
	
	//TO DO nombre horrible y confuso
	var persistidorCanales = persistidor.getSubPersistidor("canales");
	var persistidoresCanales = persistidorCanales.getSubPersistidores();
	
	
	var administradorCanales = $('#administrador_canales');
	$.each(persistidoresCanales, function (clave, persistidorCanal) {
		
		
		
		//TO DO: hacer el canal como un json, al igual que chat
		var nuevoCanal = new Canal({persistidor:persistidorCanal, 
									conjunto:conjunto.getSubConjunto(), 
									vortexComm:vortexComm,
									contexto:contexto.getSubContexto()});
		listaCanales.push(nuevoCanal);
		
		administradorCanales.append(nuevoCanal);	
		
	});
	
	
	//*********** botonAddCanal
	var botonAddCanal = $('#administrador_canales_boton_add_canal');
	var listaCanales = [];
	
	botonAddCanal.on("click", function (){
		var idCanal = "Canal" + (listaCanales.length + 1).toString();
		
		var persistidorCanal = self.persistidorCanales.getSubPersistidor(idCanal);
		persistidorCanal.setValor("idCanal", idCanal);
		persistidorCanal.setValor("canal", idCanal);
		
		
		// TO DO
		var nuevoCanal = $.extend(true,{}, canal);
		nuevoCanal.start({
			persistidor:	persistidorCanal, 
			conjunto:		self.conjunto.getSubConjunto(), 
			vortexComm:		self,
			contexto:		self.contexto.getSubContexto()
		});
		
		/*ver de juntar esto, lista canales puede ser un json que tenga metodos*/
		listaCanales.push(nuevoCanal);
		administradorCanales.append(nuevoCanal);
		
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





