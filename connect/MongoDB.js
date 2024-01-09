const mongoose = require('mongoose');
require("dotenv").config();


const MONGODB_URI = process.env.MONGODB_URI

function MongoDB(){
    mongoose.connect(MONGODB_URI)
    .then(()=>{
        console.log('Conectado ao MongoDB')
    })
    .catch((erro)=>{
        console.log('Erro ao se conectar no banco de dados!' + erro)
        console.log('Variavel de ambiente: ' + MONGODB_URI)
    })
}
module.exports = MongoDB()



