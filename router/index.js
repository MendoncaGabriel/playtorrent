const express = require('express');
const router = express.Router();
const Game = require('../model/Game.js');
const cache = require('memory-cache');

const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 horas de tempo de vida do cache em milissegundos

function renderCachedPageOrFetch(req, res, cacheKey, queryFn) {
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        console.log('Página cacheada!');
        res.render('home', { title: 'Home', data: cachedData, page: req.params.pg || req.query.page || 0 });
    } else {
        try {
            const data = queryFn();
            cache.put(cacheKey, data, CACHE_TTL);
            console.log('Cacheando página!');
            res.render('home', { title: 'Home', data, page: req.params.pg || req.query.page || 0 });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro interno do servidor');
        }
    }
}

router.get('/page/:pg', async (req, res) => {
    const pg = parseInt(req.params.pg) || 0;
    const pageSize = 20;
    const cacheKey = req.originalUrl || req.url;

    renderCachedPageOrFetch(req, res, cacheKey, () => Game.find().skip(pg * pageSize).limit(pageSize).lean().exec());
});

router.get('/', async (req, res) => {
    const pg = parseInt(req.query.page) || 0;
    const pageSize = 20;
    const cacheKey = `home:${pg}`;

    renderCachedPageOrFetch(req, res, cacheKey, () => Game.find().skip(pg * pageSize).limit(pageSize).lean().exec());
});

router.get('/download/:name', async (req, res) => {
    try {
        const nameTratado = req.params.name.replace(/-/g, ' ');
        if (!nameTratado) {
            return res.status(422).json({ msg: 'Não encontrado!' });
        }

        const cacheKey = nameTratado;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            console.log('Página cacheada!');
            return res.render('game', { data: cachedData });
        }

        const data = await Game.findOne({ name: { $regex: new RegExp(`^${nameTratado}$`, 'i') } });

        if (data) {
            cache.put(cacheKey, data, CACHE_TTL);
            console.log('Consultado database e salvo em cache!');
            res.render('game', { data });
        } else {
            res.status(404).json({ msg: 'Não encontrado!' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao carregar a página!');
    }
});

module.exports = router;
