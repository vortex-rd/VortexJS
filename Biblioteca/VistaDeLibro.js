var VistaDeLibro = function(libro, UI){
    this._ui = UI;
  
    this._label_autor = UI.find('#autor_de_libro_encontrado');
    this._label_titulo = UI.find('#titulo_de_libro_encontrado');
    
    this._label_autor.text(libro.autor());
    this._label_titulo.text(libro.titulo());
}

VistaDeLibro.prototype = {
    dibujarEn: function(panel){
        panel.append(this._ui);
    }
};