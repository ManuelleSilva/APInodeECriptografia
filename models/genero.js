const mongoose = require("mongoose");

const Genero = mongoose.model("Genero", {
    nome: String,
    descricao: String
});

module.exports = Genero;