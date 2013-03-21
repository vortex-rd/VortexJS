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


var VortexComm = function (config) {
	var persistidor = config.persistidor;
	var contexto = config.contexto;
	var conjunto = config.conjunto;
	
	conjunto.agregarFiltroEntrada(new FiltroXClaveValor('aplicacion', 'VortexComm'));	
	conjunto.agregarTrafoSalida(new TrafoXClaveValor('aplicacion', 'VortexComm'));	
	
	var nombreUsuario = persistidor.getValor('NombreDeUsuario');
	if(nombreUsuario=='') {
		nombreUsuario = 'usuario' + getIdObjeto();
		persistidor.setValor('NombreDeUsuario', nombreUsuario);
	}	
	contexto.setParametro('NombreDeUsuario', nombreUsuario);
	
	
	
	
	
    var vortexComm = $("#vortexComm");
	
	
	vortexComm.controlUsuario = vortexComm.find("#control_usuario");
	
	
	vortexComm.controlUsuario.edit = vortexComm.controlUsuario.find('.control_usuario_edit');
	vortexComm.controlUsuario.edit.val(nombreUsuario);
	
	vortexComm.controlUsuario.edit.attr('readonly', true);
	vortexComm.controlUsuario.edit.css("background-color", "transparent");
	
	
	vortexComm.controlUsuario.on("dblclick", function (e) {
		e.stopPropagation();
		
		vortexComm.controlUsuario.edit.removeAttr('readonly');
		vortexComm.controlUsuario.edit.css("background-color", "black");
		
    });
	
	vortexComm.controlUsuario.keypress(function(e) {
		if(e.which == 13) {
			e.stopPropagation();
			nombreUsuario = vortexComm.controlUsuario.edit.val();
			persistidor.setValor('NombreDeUsuario', nombreUsuario);	
			contexto.setParametro('NombreDeUsuario', nombreUsuario);
			
			vortexComm.controlUsuario.edit.attr('readonly', true);
			vortexComm.controlUsuario.edit.css("background-color", "transparent");
		}
	});
	
	vortexComm.botonAddCanal = vortexComm.find('#administrador_canales_boton_add_canal');
	
	vortexComm.listaCanales = [];
	
	vortexComm.administradorCanales = vortexComm.find('#administrador_canales');
	
	
	
	vortexComm.panelGadgets = vortexComm.find('#panel_gadgets');
	
	var persistidorCanales = persistidor.getSubPersistidor("canales");
	
	vortexComm.botonAddCanal.on("click", function (){
		var idCanal = "Canal" +  (vortexComm.listaCanales.length + 1).toString();
		
		var persistidorCanal = persistidorCanales.getSubPersistidor(idCanal);			
		persistidorCanal.setValor("idCanal", idCanal);
		persistidorCanal.setValor("canal", idCanal);
		
		var nuevoCanal = new Canal({persistidor:persistidorCanal, 
									conjunto:conjunto.getSubConjunto(), 
									vortexComm:vortexComm,
									contexto:contexto.getSubContexto()});
		
		vortexComm.listaCanales.push(nuevoCanal);
		vortexComm.administradorCanales.append(nuevoCanal);
		
		
		
	});
	
	vortexComm.desSeleccionarTodosLosCanales = function(){
		//cambiar children por .find
		//vortexComm.panelCanales.children().removeClass("control_canal_seleccionado");
		vortexComm.administradorCanales.find('.control_canal').removeClass("control_canal_seleccionado");
	};
	
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
		contexto		: contexto.getSubContexto(),
		persistidor		: persistidorGadgets.getSubPersistidor("chat" + idCanal),
		conjunto		: conjunto.getSubConjunto(),
		UI 				: plantillas.find("#plantilla_chat").clone()
	});
	
	
	var gadget_chat =  $.extend(true,{}, gadget);
	gadget_chat.start({
		title			: 'Chat',
		id				: "chat" + idCanal,
		UI 				: plantillas.find("#plantilla_gadget").clone()
	});
	gadget_chat.agregarContenido(unChat);
	
	controlCanal.gadgets.push(gadget_chat);
	
	
	
	
	
	
	var unaPizarra = $.extend(true,{}, pizarra);
	unaPizarra.start({
		contexto		: contexto.getSubContexto(),
		persistidor		: persistidorGadgets.getSubPersistidor("pizarra" + idCanal),
		conjunto		: conjunto.getSubConjunto(),
		UI 				: plantillas.find("#plantilla_pizarra").clone()
	});
	
	
	var gadget_pizarra =  $.extend(true,{}, gadget);
	gadget_pizarra.start({
		title			: 'Pizarra',
		id				: "pizarra" + idCanal,
		UI 				: plantillas.find("#plantilla_gadget").clone()
	});
	gadget_pizarra.agregarContenido(unaPizarra);
	
	controlCanal.gadgets.push(gadget_pizarra);
	
	
	
	/********************* FIN: GADGETs **************************/
	
	
	controlCanal.gadgets.forEach(function (gadget, index){
		vortexComm.panelGadgets.append(gadget.options.UI);
		
		
		gadget.options.UI.hide();
		
	});
	
	controlCanal.on("click", function (e) {
		e.stopPropagation();
		
		vortexComm.panelGadgets.children().hide();
		controlCanal.gadgets.forEach(function (gadget, index) {
		
			gadget.options.UI.show();
		});
		
		
		
		vortexComm.desSeleccionarTodosLosCanales();
		controlCanal.addClass("control_canal_seleccionado");
    });
	
	controlCanal.on("dblclick", function (e) {
		e.stopPropagation();
		
		controlCanal.edit.attr('readonly', false);
		controlCanal.edit.css("background-color", "white");
		
    });
	
	controlCanal.keypress(function(e) {
		if(e.which == 13) {
			e.stopPropagation();
			canal = controlCanal.edit.val();
			persistidor.setValor("canal", canal);
			filtroCanal.valor = canal;
			trafoCanal.valor = canal; 	
			controlCanal.edit.attr('readonly', true);
			controlCanal.edit.css("background-color", "transparent");
		}
	});
	
	$.extend(true, this, controlCanal);	
};



