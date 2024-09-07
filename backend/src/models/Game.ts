import mongoose, { Document, Schema } from 'mongoose';

// Definindo a interface para o documento do MongoDB
export interface IGame extends Document {
    name: string;
    img: string;
    video: string;
    description: string;
    information: string;
    class: string[];
    link: string;
    platform: string;
    type: string;
    download: number;
    views: number;
    comments: string[];
}

// Definindo o esquema usando Mongoose
const gameSchema = new Schema<IGame>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    img: String,
    video: String,
    description: String,
    information: String,
    class: [String], // Especificando que é um array de strings
    link: String,
    platform: String,
    type: String,
    download: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    comments: [String] // Especificando que é um array de strings
});

gameSchema.index({ name: 'text', description: 'text', information: 'text' });


// Criando o modelo tipado usando a interface IGame
const Game = mongoose.model<IGame>('Game', gameSchema);

export default Game;
