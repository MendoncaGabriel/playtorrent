const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    comment:{
        type: String
    },
    userId:{
        type: String
    },
    userName:{
        type: String
    },
    pageId:{
        type: String
    },
    date: {
        type: String
    }
});


const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;