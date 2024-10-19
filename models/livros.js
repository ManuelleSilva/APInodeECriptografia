const mongoose = require("mongoose");

const Livro = mongoose.model("Livro", {
    titulo: String,
    autor: String,
    editora: String,
    sinopse: String,
    genero: { type: mongoose.Schema.Types.ObjectId, ref: 'Genero' }, // Referência ao modelo Genero
    local: { type: mongoose.Schema.Types.ObjectId, ref: 'LocalBiblioteca' } // Referência ao modelo LocalBiblioteca
});

module.exports = Livro;
