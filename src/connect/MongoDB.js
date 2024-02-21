const mongoose = require('mongoose');
require("dotenv").config();


const MONGODB_URI = process.env.MONGODB_URI2

function MongoDB(){
    mongoose.connect(MONGODB_URI)
    .then(()=>{
        console.log('Conectado ao MongoDB')
    })
    .catch((erro)=>{
        console.log('Erro ao se conectar no banco de dados!' + erro)

    })
}
module.exports = MongoDB()



