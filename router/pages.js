const express = require('express');
const router = express.Router();
const registerView = require('../services/registerView.js')
const cache = require('memory-cache');
const http = require('http');
const https = require('https');
const cacheTime = 24 * 60 * 60 * 1000

//Schemas-----------------------------------------------------
const Game = require('../model/gameSchema.js');


//Funções--------------------------------------------------------
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
async function getGamesWithPagination(page, size) {
    return Game.find().skip(page * size).limit(size).exec();
}
async function getTopGames(field, limit) {
    const matchQuery = { [field]: { $exists: true } };
    const sortQuery = { [field]: -1 };

    return Game.aggregate([
        { $match: matchQuery },
        { $sort: sortQuery },
        { $limit: limit }
    ]);
}



//Rotas de paginas--------------------------------------------------------
// home
router.get('/', async (req, res) => {
    const DEFAULT_PAGE  = 0;
    const PAGE_SIZE = 20;
    const cacheKey = req.originalUrl || req.url;
    const cachedData = cache.get(cacheKey);

    try {
        if (cachedData) {
            const { data, dataTopViews, dataTopDownloads } = cachedData;

            if (!data || !dataTopViews || !dataTopDownloads) {
                console.error('Dados ausentes ou inválidos no cache.');
                return res.status(500).send('Erro interno do servidor');
            }

            console.log('Página com cache!');
            return res.render('home', { title: 'Home', data, page: DEFAULT_PAGE , dataTopViews, dataTopDownloads });
        }

        const [data, dataTopViews, dataTopDownloads] = await Promise.all([
            getGamesWithPagination(DEFAULT_PAGE , PAGE_SIZE),
            getTopGames('views', 10),
            getTopGames('download', 10)
        ])

        if (!data || !dataTopViews || !dataTopDownloads) {
            console.error('Dados ausentes ou inválidos.');
            return res.status(500).send('Erro interno do servidor');
        }

        cache.put(cacheKey, { data, dataTopViews, dataTopDownloads }, cacheTime);
        console.log('Sem cache, consultando banco de dados e cacheando...');

        res.render('home', { title: 'Home', data, page: DEFAULT_PAGE , dataTopViews, dataTopDownloads });
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        res.status(500).send('Erro interno do servidor');
    }
})

// paginação
router.get('/page/:pg', async (req, res) => {
    const pg = req.params.pg
    const pageSize = 20
    const cacheKey = req.originalUrl || req.url
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        res.render('page', { title: 'Home', data: cachedData, page: pg });
    } else {
        try {
            const data = await Game.find().skip(pg * pageSize).limit(pageSize).lean().exec();
            cache.put(cacheKey, data, cacheTime);
            res.render('page', { title: 'Home', data: data, page: pg });
          
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro interno do servidor');
        }
    }
})

// download
router.get('/download/:name', async (req, res) => {
    try {
        const nameTratado = req.params.name.replace(/-/g, ' ');
        if (!nameTratado) {
            return res.status(422).json({ msg: 'Nome inválido!' });
        }
        const cachedData = cache.get(nameTratado);
        if (!nameTratado) {
            return  res.status(404).render('404');
        }
        if (cachedData) {
            res.render('game', { data: cachedData });
     
        }else{
            const data = await Game.findOne({ name: { $regex: new RegExp(`^${nameTratado}$`, 'i') } })
           

            if (data) {
                cache.put(nameTratado, data, cacheTime); 
                res.render('game', { data: data });
            } else {
                res.status(404).render('404', {msg: "Jogo não encontrado!"});
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao carregar a página!');
    }
})

// Busca
router.get('/search/:name', async (req, res) => {
    try {
        const termoPesquisa = req.params.name;
        const nameTratad = termoPesquisa.replace(/-/g, ' ');
        if (!termoPesquisa) {
            return res.status(422).json({ msg: "Envie por parametro name" });
        }
        const data = await Game.find({ name: { $regex: new RegExp(`${nameTratad}`, 'i') } }).limit(10);
        res.render('search', { data: data, title: "Resultados para: " + nameTratad });
    } catch (erro) {
        res.status(422).json({ msg: 'erro ao buscar game por id!', erro: erro });
    }
})

// Lista de paginas sem capas
router.get('/checkImage', async (req, res) => {
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
})






module.exports = router;