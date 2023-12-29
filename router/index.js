const express = require('express');
const router = express.Router();
const Game = require('../model/Game.js');
const cache = require('memory-cache');
const cacheTime = 24 * 60 * 60 * 1000

router.get('/page/:pg', async (req, res) => {
    const pg = req.params.pg
    const pageSize = 20; 
    const cacheKey = req.originalUrl || req.url;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        res.render('home', { title: 'Home', data: cachedData, page: pg });
    } else {
        try {
            const data = await Game.find().skip(pg * pageSize).limit(pageSize).exec();
            cache.put(cacheKey, data, cacheTime);
            res.render('home', { title: 'Home', data: data, page: pg });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro interno do servidor');
        }
    }
})

router.get('/page/:pg', async (req, res) => {
    const pg = parseInt(req.params.pg) || 0;
    const pageSize = 20;
    const cacheKey = req.originalUrl || req.url;
    renderCachedPageOrFetch(req, res, cacheKey, () => Game.find().skip(pg * pageSize).limit(pageSize).lean().exec());
})

router.get('/', async (req, res) => {
    const pg = 0; 
    const pageSize = 20; 
    const cacheKey = req.originalUrl || req.url;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        res.render('home', { title: 'Home', data: cachedData, page: pg });
    } else {
        try {
            const data = await Game.find().skip(pg * pageSize).limit(pageSize).exec();
            cache.put(cacheKey, data, cacheTime);
            res.render('home', { title: 'Home', data: data, page: pg });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro interno do servidor');
        }
    }
})

router.get('/download/:name', async (req, res) => {
    try {
        const nameTratado = req.params.name.replace(/-/g, ' ');
        if (!nameTratado) {
            return res.status(422).json({ msg: 'Não encontrado!' });
        }
        const cachedData = cache.get(nameTratado);
        if (cachedData) {
            return res.render('game', { data: cachedData });
        }
        const data = await Game.findOne({ name: { $regex: new RegExp(`^${nameTratado}$`, 'i') } });
        if (data) {
            cache.put(nameTratado, data, cacheTime); 
            res.render('game', { data: data });
        } else {
            res.status(404).json({ msg: 'Não encontrado!' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao carregar a página!');
    }
})


async function isImageValid(teste) {
    let url = 'http://localhost:3000/cover/' + teste
    try {
        // Verifica se a URL termina com uma extensão de imagem comum
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        const isImageExtension = imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
    
        if (!isImageExtension) {
        return false;
        }
    
        // Determina o módulo HTTP com base no protocolo da URL
        const protocol = url.startsWith('https') ? https : http;
    
        // Faz uma requisição HEAD para obter o cabeçalho da imagem sem baixar todo o conteúdo
        const response = await new Promise((resolve, reject) => {
        const req = protocol.request(url, { method: 'HEAD' }, resolve);
        req.on('error', reject);
        req.end();
        });
    
        // Verifica se o cabeçalho Content-Type indica que é uma imagem
        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.startsWith('image/')) {
        return false;
        }
    
        // Pode adicionar mais verificações aqui, se necessário
    
        return true;
    } catch (error) {
        console.error('Erro ao verificar a imagem:', error.message);
        return false;
    }
}


const http = require('http');
const https = require('https');

router.get('/testeimage', async (req, res) => {
    try {
        const data = await Game.find({});
        let imgfaltando = [];

        for (const e of data) {
            let validation = await isImageValid(e.img);
            if (!validation) {
                imgfaltando.push(e);
            }
        }

        res.render('buscarImagem', { data: imgfaltando });
    } catch (error) {
        console.error('Erro no teste de imagem:', error);
        res.status(500).send('Erro no teste de imagem');
    }
});


module.exports = router;
