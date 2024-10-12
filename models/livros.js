const mongoose = require("mongoose");

const Livro = mongoose.model("Livro", {
    titulo: String,
    autor: String,
    editora: String,
    sinopse: String,
    local: { type: mongoose.Schema.Types.ObjectId, ref: 'LocalBiblioteca' },
    genero: { type: mongoose.Schema.Types.ObjectId, ref: 'Genero' } 

});

module.exports = Livro;