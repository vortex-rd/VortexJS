var NodoVistaDeEdicionDeLibro = function(cfg){
    this._ui = cfg.UI;
  
    this._label_autor = UI.find('#autor_de_libro_encontrado');
    this._label_titulo = UI.find('#titulo_de_libro_encontrado');
    
    this._label_autor.text(cfg.autor());
    this._label_titulo.text(cfg.titulo());
}

VistaDeLibroEnBuscador.prototype = {
    dibujarEn: function(panel){
        panel.append(this._ui);
    }
};