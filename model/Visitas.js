const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    views: Number,
    date: { 
        type: Date, 
        default: Date.now 
    }
});

const Visitas = mongoose.model('VISITAS', analyticsSchema);

module.exports = Visitas;
