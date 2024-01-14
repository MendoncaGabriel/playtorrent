const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    comment:{
        type: String
    },
    idUser:{
        type: String
    },
    userName:{
        type: String
    },
    idPage:{
        type: String
    },
    date: {
        type: String
    }
});


const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;