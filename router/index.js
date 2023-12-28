const express = require('express')
const router = express.Router();
const Game = require('../model/Game.js')

router.get('/', async (req, res) => {
    const pg = 0; // Página atual (se você quiser implementar paginação)
    const pageSize = 20; // Número de documentos a serem recuperados

    try {
        const data = await Game.find().skip(pg * pageSize).limit(pageSize).exec();
        res.render('home', { title: 'Home', data: data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
});


// Rota com barra antes do parâmetro :name
router.get('/game/:name', (req, res) => {
    const name = req.params.name;
    res.render('game', { name: name });
});



module.exports = router;