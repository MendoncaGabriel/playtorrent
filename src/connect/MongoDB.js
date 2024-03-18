// Carrega as variáveis de ambiente do arquivo .env
require("dotenv").config();

const mongoose = require('mongoose');

// Obtém o URI do MongoDB a partir da variável de ambiente
const MONGODB_URI = process.env.MONGODB_URI2 || 'mongodb+srv://Gabroviski1997:r1vHlj2n32Rblmdl@cluster0.vuws7v9.mongodb.net/?retryWrites=true&w=majority'

function connectToMongoDB() {
    mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Conectado ao MongoDB');
        })
        .catch((error) => {
            console.error('Erro ao se conectar no banco de dados!', error);
        });
}

// Exporta a função para que ela possa ser chamada em outro lugar do seu código
module.exports = connectToMongoDB;


