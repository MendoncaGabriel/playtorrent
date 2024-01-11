require('dotenv').config()
const express = require('express');
const router = express.Router();
const Visitas = require('../model/Visitas.js')
const Game = require('../model/gameSchema.js')


router.use(express.json());
router.post('/constView', async (req, res) => {
    try {
        // Verificar se existe um documento com a data atual
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Define a hora para 00:00:00

        const documentoAtual = await Visitas.findOne({ date: hoje });

        if (documentoAtual) {
            // Se já existe um documento para a data atual, incrementar o total de visitas
            documentoAtual.views += 1;
            await documentoAtual.save();
            res.status(200).json({ msg: 'Visita registrada com sucesso!, Total: ' + documentoAtual.views });
        } else {
            // Se não existe um documento para a data atual, criar um novo documento com total 1
            const novoDocumento = new Visitas({ views: 1, date: hoje });
            await novoDocumento.save();
            res.status(200).json({ msg: 'Visita registrada com sucesso!, Total: 1' });
        }
    } catch (erro) {
        console.error('Erro ao incrementar o total de visitas:', erro.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
//Relatorio de visitas
router.get('/views', async (req, res) => {
    try {
        const data = await Visitas.find({});
        res.render('views', { data });
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.post('/chat', async (req, res) => {
    try {
        const data = req.body;
        const gameId = data.id;

        const updatedGame = await Game.findByIdAndUpdate(
            gameId,
            { $push: { comments: { commit: data.commit, user: data.user, date: data.date } } },
            { new: true }
        );

        if (updatedGame) {
            console.log('Comentário adicionado com sucesso:');
            res.status(200).json({ success: true });
        } else {
            console.error('Jogo não encontrado com o ID fornecido.');
            res.status(404).json({ success: false, error: 'Jogo não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao processar a solicitação:', error);
        res.status(500).json({ success: false, error: 'Erro interno no servidor' });
    }
});

router.get('/comments/:id', async (req, res) => {
    try {
        const gameId = req.params.id;

        const game = await Game.findById(gameId);

        if (game) {
            const comments = game.comments || [];
            res.status(200).json({ success: true, comments });
        } else {
            console.error('Jogo não encontrado com o ID fornecido.');
            res.status(404).json({ success: false, error: 'Jogo não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao processar a solicitação:', error);
        res.status(500).json({ success: false, error: 'Erro interno no servidor' });
    }
});





module.exports = router;