const mongoose = require('mongoose')
require("dotenv").config();


const dbuser = process.env.DB_USER;
const dbpass = process.env.DB_PASS;

function MongoDB(){
    mongoose.connect(`mongodb+srv://${dbuser}:${dbpass}@cluster0.vuws7v9.mongodb.net/?retryWrites=true&w=majority`)
    .then(()=>{
        console.log('Conectado ao MongoDB')
    })
    .catch((erro)=>{
        console.log('Erro ao se conectar no banco de dados!')
    })
}
module.exports = MongoDB()