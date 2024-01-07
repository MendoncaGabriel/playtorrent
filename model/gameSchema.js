const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    img: String,
    video: String,
    description: String,
    information: String,
    class: Array,
    link: String,
    platform: String,
    type: String,
    download: Number,
    views: Number,
});

// Crie um índice no campo 'name'
gameSchema.index({ name: 1 });

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
