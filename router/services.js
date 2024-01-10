require('dotenv').config()
const express = require('express');
const router = express.Router();
const Visitas = require('../model/Visitas.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/user.js')



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







module.exports = router;