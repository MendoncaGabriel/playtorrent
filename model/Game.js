const mongoose = require('mongoose')

const Game = mongoose.model('Game', {
    name: String,
    img: String,
    video: String,
    description: String,
    information: String,
    class: Array,
    link: String,
    platform: String,
    type: String,
    download: Number,
})

module.exports = Game