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
    comments: Array
});

// Crie um índice no campo 'name'
gameSchema.index({ name: 1 });
gameSchema.index({ views: 1 });
gameSchema.index({ download: 1 });

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
