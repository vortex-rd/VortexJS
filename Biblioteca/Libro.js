var Libro = function(cfg){
    this._titulo = cfg.titulo || "";
    this._autor = cfg.autor || "";
}

Libro.prototype = {
    titulo : function() {
        return this._titulo;
    },
    autor : function() {
        return this._autor;
    }
};