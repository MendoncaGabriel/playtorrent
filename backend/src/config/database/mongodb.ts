import mongoose from 'mongoose';


const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) throw new Error('Variável de ambiente MONGODB_URI não encontrada');


// Conecta ao MongoDB
mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('Conectado ao MongoDB');
})
.catch((error) => {
    console.error('Erro ao se conectar ao banco de dados!', error);
});

export default mongoose;
