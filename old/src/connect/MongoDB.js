// Carrega as variáveis de ambiente do arquivo .env
require("dotenv").config();

const mongoose = require('mongoose');

// Obtém o URI do MongoDB a partir da variável de ambiente
const MONGODB_URI = process.env.MONGODB_URI2


module.exports =  mongoose.connect(MONGODB_URI)
        .then(() => {
            console.log('Conectado ao MongoDB');
        })
        .catch((error) => {
            console.error('Erro ao se conectar no banco de dados!', error);
        });






