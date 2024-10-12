const mongoose = require("mongoose");

const LocalBiblioteca = mongoose.model("LocalBiblioteca", {
    local: String,
    secao: String
});

module.exports = LocalBiblioteca;