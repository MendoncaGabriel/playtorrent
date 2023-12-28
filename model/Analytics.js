const mongoose = require('mongoose');

const Analitycs = mongoose.model('Analitycs', {
    visualizacao: Number
});

module.exports = Analitycs;
