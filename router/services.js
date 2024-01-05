const express = require('express');
const router = express.Router();
const Game = require('../model/gameSchema.js');

router.patch('/downloadCont/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const game = await Game.findById(id);

        if (!game) {
            return res.status(404).json({ msg: 'Jogo não encontrado' });
        }

        const update = { $inc: { download: 1 } };

        // Se `download` não existe, não tente definir diretamente
        // o MongoDB cuidará disso automaticamente com `$inc`
        
        const newUpdate = await Game.findByIdAndUpdate(id, update, { new: true });

        return res.status(200).json({
            msg: newUpdate.download === 1 ? 'Primeiro download contado com sucesso' : 'Download contado com sucesso',
            download: newUpdate.download
        });
    } catch (err) {
        console.error('Erro ao contar download:', err);
        res.status(500).send('Erro ao contar download');
    }
})


module.exports = router;