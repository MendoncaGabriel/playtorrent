const mongoose = require('mongoose')
require("dotenv").config();

function MongoDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log('Conectado ao MongoDB')
    })
    .catch((erro)=>{
        console.log('Erro ao se conectar no banco de dados!')
    })
}
module.exports = MongoDB()