
var KanbanBoard = function (config) {
    var kanban = $("#protoKanbanBoard").clone();
	var id = config.id;
	var persistidor = config.persistidor;
	var contexto = config.contexto;
	var conjunto = config.conjunto;
	
    kanban.attr("id", id);
    
	var filtroGadget = new FiltroXClaveValor("gadget", 'kanbanBoard');
	var trafoGadget = new TrafoXClaveValor('gadget', 'kanbanBoard');
	
	conjunto.agregarFiltroEntrada(filtroGadget);	
	conjunto.agregarTrafoSalida(trafoGadget);	
		
	var inicializarPaneles = function(){
		var panelPasado = new PanelTareas({	idPanel:"panel1", 
											nombre:"Falta", 
											mostrar_boton_add:false, 
											kanban:kanban,
											persistidor:persistidor.getSubPersistidor("panel1"), 											 
											contexto:contexto.getSubContexto(),
											conjunto:conjunto.getSubConjunto()});
		var panelPresente = new PanelTareas({idPanel:"panel2", 
											nombre:">>>>>>>>>>>>>", 
											mostrar_boton_add:false, 
											kanban:kanban, 
											persistidor:persistidor.getSubPersistidor("panel2"), 											
											contexto:contexto.getSubContexto(),
											conjunto:conjunto.getSubConjunto()});
		var panelFuturo = new PanelTareas({	idPanel:"panel3", 
											nombre:"Hay", 
											mostrar_boton_add:true, 
											kanban:kanban, 
											persistidor:persistidor.getSubPersistidor("panel3"), 
											contexto:contexto.getSubContexto(),
											conjunto:conjunto.getSubConjunto()});

		kanban.append(panelPasado);
		kanban.append(panelPresente);
		kanban.append(panelFuturo);
	};
	
	this.tareaOnDrag = {};
    this.repTareaOnDrag = {};
    this.panelOrigenDrag = {};
    this.panelDestinoDrag = {};

	var conjuntoPedidoDeSincronizacion = conjunto.getSubConjunto();
	conjuntoPedidoDeSincronizacion.agregarFiltroEntrada(new FiltroXClaveValor("tipoDeMensaje", "pedidoDeSincronizacion"));
	conjuntoPedidoDeSincronizacion.agregarFiltroEntrada(new FiltroXClaveValor("idObjeto", id));
	conjuntoPedidoDeSincronizacion.agregarTrafoSalida(new TrafoXClaveValor("tipoDeMensaje", "pedidoDeSincronizacion"));
	conjuntoPedidoDeSincronizacion.agregarTrafoSalida(new TrafoXClaveValor("idObjeto", id));
	
	var conjuntoRespuestaDeSincronizacion = conjunto.getSubConjunto();
	conjuntoRespuestaDeSincronizacion.agregarFiltroEntrada(new FiltroXClaveValor("tipoDeMensaje", "respuestaDeSincronizacion"));
	conjuntoRespuestaDeSincronizacion.agregarFiltroEntrada(new FiltroXClaveValor("idObjeto", id));
	conjuntoRespuestaDeSincronizacion.agregarTrafoSalida(new TrafoXClaveValor("tipoDeMensaje", "respuestaDeSincronizacion"));
	conjuntoRespuestaDeSincronizacion.agregarTrafoSalida(new TrafoXClaveValor("idObjeto", id));
	
	
	conjuntoPedidoDeSincronizacion.pedirMensajes(function (mensaje) {
			conjuntoRespuestaDeSincronizacion.recibirMensaje({ 										
									idPedido: mensaje.idPedido, 
									diferenciasConObjetoSolicitante: persistidor.serializar()});
		});
			
	kanban.iniciarSincronizacion = function(){
		var idPedido = getIdObjeto();
		conjuntoRespuestaDeSincronizacion.pedirMensajesPasandoFiltros([new FiltroXClaveValor("idPedido", idPedido)],
			function (mensaje) {
				persistidor.desSerializar(mensaje.diferenciasConObjetoSolicitante);
				kanban.empty();
				inicializarPaneles();
			});
			
		conjuntoPedidoDeSincronizacion.recibirMensaje({ 
								idPedido: idPedido, 
								estadoObjetoSolicitante: persistidor.serializar()});
	}
	
	inicializarPaneles();
    $.extend(true, this, kanban);
}

var PanelTareas = function (config){
    var panel = $("#protoPanelTarea").clone();
	
	var idPanel = config.idPanel;
	var nombre = config.nombre;
	var portal = config.portal;
	var mostrar_boton_add = config.mostrar_boton_add;
	var persistidor = config.persistidor;
	var kanban = config.kanban;
	var contexto = config.contexto;
	var conjunto = config.conjunto;
    
    var conjuntoDelPanel = conjunto.getSubConjunto();
	conjuntoDelPanel.agregarFiltroEntrada(new FiltroXClaveValor("idPanel", idPanel));
	conjuntoDelPanel.agregarTrafoSalida(new TrafoXClaveValor("idPanel", idPanel));
	
    var conjuntoAgregarTareaAPanel = conjuntoDelPanel.getSubConjunto();
	conjuntoAgregarTareaAPanel.agregarFiltroEntrada(new FiltroXClaveValor("tipoDeMensaje", "agregarTareaAPanel"));
	conjuntoAgregarTareaAPanel.agregarTrafoSalida(new TrafoXClaveValor("tipoDeMensaje", "agregarTareaAPanel"));
     
    var conjuntoQuitarTareaDePanel = conjuntoDelPanel.getSubConjunto();
	conjuntoQuitarTareaDePanel.agregarFiltroEntrada(new FiltroXClaveValor("tipoDeMensaje", "quitarTareaDePanel"));
	conjuntoQuitarTareaDePanel.agregarTrafoSalida(new TrafoXClaveValor("tipoDeMensaje", "quitarTareaDePanel"));
	
	conjuntoAgregarTareaAPanel.pedirMensajes(function (mensaje) {
		    if(!tengoLaTarea(mensaje.idTarea)){
				persistidorTarea = persistidor.getSubPersistidor(mensaje.idTarea);
				persistidorTarea.setValor("id", mensaje.idTarea);
				persistidorTarea.setValor("nombre", mensaje.nombre);
				persistidorTarea.setValor("descripcion", mensaje.descripcion);
			    var tarea = new Tarea({	contexto:contexto.getSubContexto(),
										persistidor:persistidorTarea, 
										conjunto:conjunto.getSubConjunto()});			
			    AddTarea(tarea);
            }
        });

	conjuntoQuitarTareaDePanel.pedirMensajes(function (mensaje) {
			var tarea = obtenerTareaDesdeId(mensaje.idTarea);
			if(!(tarea===undefined)) RemoveTarea(tarea);
        });

    var _id = idPanel;
    panel.getId = function () { return _id; };

    panel.attr("id", idPanel);

    var tareas = [];
		
    panel.representacionesTareas = [];
	
	panel.botonAddTarea = panel.find('.panel_tareas_boton_add_tarea');
	if(mostrar_boton_add){
		panel.botonAddTarea.on("click", function () {
            var idtarea = 't' + getIdObjeto();    
			var persistidorTarea = persistidor.getSubPersistidor(idtarea);		
			persistidorTarea.setValor("id", idtarea);
			persistidorTarea.setValor("nombre", "Nueva Tarea");
			persistidorTarea.setValor("descripcion", "");
			var nuevaTarea = new Tarea({	contexto:contexto.getSubContexto(),
											persistidor:persistidorTarea, 
											conjunto:conjunto.getSubConjunto()});			
			panel.AgregarTarea(nuevaTarea);
		});
	}else{
		panel.botonAddTarea.hide();
	}
    panel.listaTareas = panel.find('.panel_tareas_lista_tareas');
    
	panel.listaTareas.droppable({
		accept: function(){
				var retVal;
				if(kanban.panelOrigenDrag != panel){
					retVal = true;
				} else { 
					retVal = false;
				}
				return retVal;
			},
        drop: function (event, ui) {
				kanban.panelOrigenDrag.QuitarTarea(kanban.tareaOnDrag);
                agregarPersistenciaATarea(kanban.tareaOnDrag);
				panel.AgregarTarea(kanban.tareaOnDrag);
        }
    });
	panel.listaTareas.on("click", function () {
			panel.contraerTodo();
		});
	
	panel.disableSelection();
	
    panel.lblNombre = panel.find('.panel_tareas_nombre_panel');

    panel.lblNombre.text(nombre);

    panel.AgregarTarea = function (una_tarea) {
        AddTarea(una_tarea);
		conjuntoAgregarTareaAPanel.recibirMensaje({
								idTarea: una_tarea.getId(), 
								nombre: una_tarea.getNombre(), 
								descripcion: una_tarea.getDescripcion()
								});
	};

    panel.QuitarTarea = function (una_tarea) {
        RemoveTarea(una_tarea);
        conjuntoQuitarTareaDePanel.recibirMensaje({
								idTarea: una_tarea.getId()
								});        
    };
        
    panel.contraerTodo = function () {
        panel.representacionesTareas.forEach(function (rep) {
            rep.contraer();
        });
    }

    var AddTarea = function (una_tarea) {
		if(!tengoLaTarea(una_tarea.getId())){
			tareas.push(una_tarea);
			var rep = new RepresentacionTarea(una_tarea, panel, kanban);
			panel.representacionesTareas.push(rep);
			panel.listaTareas.append(rep);            
		}
    }

    var agregarPersistenciaATarea = function(una_tarea){
        una_tarea.cambiarPersistidor(persistidor.getSubPersistidor(una_tarea.getId()));
    }

    var RemoveTarea = function (una_tarea) {
        var indexTarea;
        var indexRep;
        var repTarea;

        tareas.forEach(function (tarea, index) { if (tarea.getId() == una_tarea.getId()) indexTarea = index; })
        tareas.splice(indexTarea, 1);

        panel.representacionesTareas.forEach(function (rep, index) { if (rep.tarea.getId() == una_tarea.getId()) { indexRep = index; repTarea = rep; } });
        panel.representacionesTareas.splice(indexRep, 1);
		
        //divPersistencia.find('#P_' + una_tarea.getId()).remove(); 
		persistidor.quitarValor(una_tarea.getId());
        repTarea.remove();
    }


    var tengoLaTarea = function (idTarea) {
        return !(obtenerTareaDesdeId(idTarea) === undefined);
    }

    var obtenerTareaDesdeId = function (idTarea) {
        return tareas.filter(function (tarea) { return (tarea.getId() == idTarea); })[0];
    }

	//persistencia	
	var persistidoresTareas = persistidor.getSubPersistidores();
	$.each(persistidoresTareas, function (clave, persistidorTarea) {
			var tarea = new Tarea({	contexto:contexto.getSubContexto(),
									persistidor:persistidorTarea, 
									conjunto:conjunto.getSubConjunto()});
			AddTarea(tarea);
    	});
	
    $.extend(true, this, panel);
}

var Tarea = function (config) {
	// Variables privadas
	var persistidor = config.persistidor;	
	var conjunto = config.conjunto;
	var contexto = config.contexto;	
	var _id = persistidor.getValor("id");	
	var conjuntoUpdate = conjunto.getSubConjunto();
	
	conjuntoUpdate.agregarFiltroEntrada(new FiltroXClaveValor("idTarea", _id));
	conjuntoUpdate.agregarTrafoSalida(new TrafoXClaveValor("idTarea", _id));
	conjuntoUpdate.agregarFiltroEntrada(new FiltroXClaveValor("tipoDeMensaje", "updateTarea"));
	conjuntoUpdate.agregarTrafoSalida(new TrafoXClaveValor("tipoDeMensaje", "updateTarea"));
	
    this.getId = function () { return _id; };    

    var _nombre = persistidor.getValor("nombre");
    this.getNombre = function () { return _nombre; };
    this.setNombre = function (un_nombre) {
        _nombre = un_nombre;
        _representacion.actualizar();
        this.enviarMensajeUpdate();
        persistidor.setValor("nombre", _nombre);
    };

    var _descripcion = persistidor.getValor("descripcion");
    this.getDescripcion = function () { return _descripcion; };
    this.setDescripcion = function (una_descripcion) {
        _descripcion = una_descripcion;
        _representacion.actualizar();
        this.enviarMensajeUpdate();
        persistidor.setValor("descripcion", _descripcion);
    };

    var _representacion = { actualizar: function () { } }
    this.setRepresentacion = function (rep) { _representacion = rep; };

    conjuntoUpdate.pedirMensajes(function (mensaje) {
        _nombre = mensaje.nombre;
        _descripcion = mensaje.descripcion;
        _representacion.actualizar();
    });

    this.enviarMensajeUpdate = function () {
        conjuntoUpdate.recibirMensaje({ nombre: _nombre, descripcion: _descripcion});
    }

    var getResumen = function(){
        return JSON.stringify({ idTarea: _id, nombre: _nombre, descripcion: _descripcion });
    }
	
	this.cambiarPersistidor = function(pers){
		persistidor = pers;
		guardar();
	};
	
	var guardar = function(){
		persistidor.setValor("id", _id);
		persistidor.setValor("nombre", _nombre);
		persistidor.setValor("descripcion", _descripcion);
	};
}


var RepresentacionTarea = function (una_tarea, panelContenedor, kanban) {
    var RepTarea = $("#protoTarea").clone();
    RepTarea.tarea = una_tarea;

    RepTarea.draggable({
        distance: 20 ,
        revert: "invalid",
        start: function (ui) {
            kanban.tareaOnDrag = una_tarea;
			kanban.repTareaOnDrag = RepTarea;
			RepTarea.hide();
            kanban.panelOrigenDrag = panelContenedor;
            kanban.panelDestinoDrag = {};
        },
		stop: function(ui){
			kanban.repTareaOnDrag.show();
		},
		scroll: false,
		connectToSortable: panelContenedor.listaTareas,
		helper: function(ev, ui) { return RepTarea.clone().width(RepTarea.width()); },
		appendTo: 'body'
    });

    RepTarea.addClass("tarea_contraida");
    RepTarea.attr('id', "repTarea" + una_tarea.getId());
    RepTarea.lblNombre = RepTarea.find('.tarea_contraida_label');

    RepTarea.txtNombre = RepTarea.find('.tarea_expandida_nombre');
    RepTarea.txtNombre.on("change", function () { una_tarea.setNombre(RepTarea.txtNombre.val());});

    RepTarea.txtDescripcion = RepTarea.find('.tarea_expandida_descripcion');
    RepTarea.txtDescripcion.on("change", function () { una_tarea.setDescripcion(RepTarea.txtDescripcion.val());});

    RepTarea.on("click", function (e) {
		e.stopPropagation();
        panelContenedor.contraerTodo();
        RepTarea.expandir();
    });

    RepTarea.expandir = function () {
        RepTarea.removeClass("tarea_contraida");
        RepTarea.addClass("tarea_expandida");
    }

    RepTarea.contraer = function () {
        RepTarea.removeClass("tarea_expandida");
        RepTarea.addClass("tarea_contraida");
    }

    RepTarea.actualizar = function () {
        RepTarea.txtNombre.val(una_tarea.getNombre);
        RepTarea.txtDescripcion.val(una_tarea.getDescripcion);
        RepTarea.lblNombre.text(una_tarea.getNombre());
    }

    RepTarea.actualizar();
    una_tarea.setRepresentacion(RepTarea);

    $.extend(true, this, RepTarea);
}