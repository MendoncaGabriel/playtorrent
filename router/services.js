require('dotenv').config()
const express = require('express');
const router = express.Router();
const Game = require('../model/gameSchema.js')
const checkToken = require('../services/checkToken.js')
const filterProfanity = require('../services/filterProfanity.js')


router.use(express.json());
router.post('/chat', checkToken, async (req, res) => {
    try {
        const data = req.body;
        const gameId = data.id;


        const comentario = filterProfanity(data.commit)
        const sanitizedMessage = req.sanitize(comentario);

        const updatedGame = await Game.findByIdAndUpdate(
            gameId,
            { $push: { comments: { commit: sanitizedMessage, user: data.user, commentId:data.commentId, date: data.date } } },
            { new: true }
        ).lean();

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

router.delete('/chat', checkToken, async (req, res) => {
    try {
        const idGame = req.body.idGame;
        const commentIdToRemove = req.body.commentId;
        const commit = req.body.commit;

        const updatedGame = await Game.findByIdAndUpdate(
            idGame,
            {
                $pull: {
                    comments: {
                        commentId: commentIdToRemove,
                        commit: commit
                    }
                }
            },
            { new: true }
        );

        if (!updatedGame) {
            return res.status(404).json({ error: 'Jogo não encontrado' });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/comments/:id', async (req, res) => {
    try {
        const gameId = req.params.id;

        const game = await Game.findById(gameId).lean();

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