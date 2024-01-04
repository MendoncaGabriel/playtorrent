const express = require('express');
const router = express.Router();
const registerView = require('../services/registerView.js')
const cache = require('memory-cache');
const http = require('http');
const https = require('https');
const cacheTime = 24 * 60 * 60 * 1000

//Schemas-----------------------------------------------------
const Game = require('../model/gameSchema.js');
const analyticsSchema = require('../model/analyticsSchema.js')

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
async function contViwer(id){
    try {
        const game = await Game.findById(id);

        await registerView(game);
        if (!game) {
            return res.status(404).json({ msg: 'Jogo não encontrado' });
        }
        if (!game.views) {
            await Game.findByIdAndUpdate(id, { views: 1 }, { new: true });
        }

        await Game.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
    } catch (err) {
        console.error('Erro ao contar visualização:', err);
    }
}


//Rotas--------------------------------------------------------
router.get('/', async (req, res) => {
    const pg = 0;
    const pageSize = 20;
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
            return res.render('home', { title: 'Home', data, page: pg, dataTopViews, dataTopDownloads });
        }

        const [data, dataTopViews, dataTopDownloads] = await Promise.all([
            getGamesWithPagination(pg, pageSize),
            getTopGames('views', 10),
            getTopGames('download', 10)
        ]);

        if (!data || !dataTopViews || !dataTopDownloads) {
            console.error('Dados ausentes ou inválidos.');
            return res.status(500).send('Erro interno do servidor');
        }

        cache.put(cacheKey, { data, dataTopViews, dataTopDownloads }, cacheTime);
        console.log('Sem cache, consultando banco de dados e cacheando...');

        res.render('home', { title: 'Home', data, page: pg, dataTopViews, dataTopDownloads });
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        res.status(500).send('Erro interno do servidor');
    }
})

router.get('/page/:pg', async (req, res) => {
    const pg = req.params.pg
    const pageSize = 20; 
    const cacheKey = req.originalUrl || req.url;
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

router.get('/edit-page', (req, res)=>{
    
    res.render('editPage')
})

router.get('/download/:name', async (req, res) => {
    try {
        const nameTratado = req.params.name.replace(/-/g, ' ');
        const cachedData = cache.get(nameTratado);
 
        if (!nameTratado) {
            return res.status(422).json({ msg: 'Não encontrado!' });
        }
        
        if (cachedData) {
            console.log('CACHE')
            res.render('game', { data: cachedData });
            contViwer(`${cachedData._id}`)
        }else{
            console.log('NO-CACHE')


            const data = await Game.findOne({ name: { $regex: new RegExp(`^${nameTratado}$`, 'i') } })



            if (data) {
                cache.put(nameTratado, data, cacheTime); 
                res.render('game', { data: data });
                contViwer(`${data._id}`) 
            } else {
                res.status(404).json({ msg: 'Não encontrado!' });
            }
        }


    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao carregar a página!');
    }
})

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
});


router.get('/analytics', async (req, res) => {
    try {
        let query = {};
        const selectedDate = req.query.date;

        if (selectedDate) {
            // Se uma data for fornecida, filtrar por essa data
            query = {
                views: { $exists: true },
                date: new Date(selectedDate + 'T00:00:00.000Z') // Considerando que a data é fornecida no formato YYYY-MM-DD
            };
        } else {
            // Caso contrário, retornar todos os dados
            query = { views: { $exists: true } };
        }

        const gamesWithViews = await analyticsSchema.find(query)
            .sort({ views: -1 }) // Ordena pelo campo 'views' do maior para o menor
            .select('name views date');

        // Calcular o total de visualizações
        const totalViews = gamesWithViews.reduce((total, game) => total + game.views, 0);

        if (req.headers.accept.includes('application/json')) {
            // Se a solicitação aceitar JSON, retorne os dados como JSON
            res.json(gamesWithViews, totalViews );
        } else {
            // Caso contrário, renderize a página EJS
            res.render('analytics', { data: gamesWithViews, totalViews: totalViews  });
        }
    } catch (err) {
        console.error('Erro ao obter jogos com visualizações:', err);
        res.status(500).send('Erro ao obter jogos com visualizações');
    }
})

router.get('/analytics/:time', async (req, res) => {
    const time = req.params.time;

    try {
        let query = {};
        const selectedDate = req.params.time;

        if (selectedDate) {
            // Se uma data for fornecida, filtrar por essa data
            query = {
                views: { $exists: true },
                date: new Date(selectedDate + 'T00:00:00.000Z') // Considerando que a data é fornecida no formato YYYY-MM-DD
            };
        } else {
            // Caso contrário, retornar todos os dados
            query = { views: { $exists: true } };
        }

        const gamesWithViews = await analyticsSchema.find(query)
            .sort({ views: -1 }) // Ordena pelo campo 'views' do maior para o menor
            .select('name views date');

        // Calcular o total de visualizações
        const totalViews = gamesWithViews.reduce((total, game) => total + game.views, 0);

        if (req.headers.accept.includes('application/json')) {
            // Se a solicitação aceitar JSON, retorne os dados como JSON
            res.json(gamesWithViews, totalViews);
        } else {
            // Caso contrário, renderize a página EJS
            res.render('analytics', { data: gamesWithViews, totalViews});
        }
    } catch (err) {
        console.error('Erro ao obter jogos com visualizações:', err);
        res.status(500).send('Erro ao obter jogos com visualizações');
    }
})

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

router.get('/renameImage', async (req, res) => {
    try {
        const games = await Game.find({});
        let cont = 0;
        for (const e of games) {
            await Game.findByIdAndUpdate(e._id, { img: e._id + '.webp' });
            cont++;
        }
        res.send('Images renamed successfully.');
    } catch (error) {
        console.error('Error renaming images:', error);
        res.status(500).send('Internal Server Error');
    }
})

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


module.exports = router;