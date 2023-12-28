const express = require('express')
const router = express.Router();
const Game = require('../model/Game.js')
const cache = require('memory-cache');


router.get('/page/:pg', async (req, res) => {
    const pg = req.params.pg
    const pageSize = 20; 
    const cacheKey = req.originalUrl || req.url;

    // Verificar se os dados estão em cache
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        // Se estiver em cache, renderizar a partir do cache
        console.log('----------------------------');

        console.log('Página principal cacheada!');
        console.log('----------------------------');
        res.render('home', { title: 'Home', data: cachedData, page: pg });
    } else {
        try {
            // Se não estiver em cache, buscar dados no banco de dados
            const data = await Game.find().skip(pg * pageSize).limit(pageSize).exec();
            console.log('-------------------------------------');
            console.log('Cacheando página principal!');
            console.log('-------------------------------------');

            // Colocar os dados em cache por 2 horas
            cache.put(cacheKey, data, 2 * 60 * 60 * 1000);

            // Renderizar a página com os dados recém-obtidos
            res.render('home', { title: 'Home', data: data, page: pg });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro interno do servidor');
        }
    }
});

router.get('/', async (req, res) => {
    const pg = 0; // Página atual (se você quiser implementar paginação)
    const pageSize = 20; // Número de documentos a serem recuperados
    const cacheKey = req.originalUrl || req.url;

    // Verificar se os dados estão em cache
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        // Se estiver em cache, renderizar a partir do cache
        console.log('----------------------------');
        console.log('Página principal cacheada!');
        console.log('----------------------------');
        res.render('home', { title: 'Home', data: cachedData, page: pg });
    } else {
        try {
            // Se não estiver em cache, buscar dados no banco de dados
            const data = await Game.find().skip(pg * pageSize).limit(pageSize).exec();
            console.log('-------------------------------------');
            console.log('Cacheando página principal!');
            console.log('-------------------------------------');

            // Colocar os dados em cache por 2 horas
            cache.put(cacheKey, data, 2 * 60 * 60 * 1000);

            // Renderizar a página com os dados recém-obtidos
            res.render('home', { title: 'Home', data: data, page: pg });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro interno do servidor');
        }
    }
});
router.get('/download/:name', async (req, res) => {
    try{
        const name = req.params.name
        const nameTratad = name.replace(/-/g, ' ')
        if(!name){
            return res.status(422).json({msg: "Não encontrado!"})
        }

        // Verifique se os dados estão no cache
        const cachedData = cache.get(nameTratad);

        if (cachedData) {
            // Se estiver no cache, retorne os dados do cache
            console.log('----------------------------')
            console.log('Pagina cacheada!')
            console.log('----------------------------')
            return res.render('game', { data: cachedData });
        }


        // Se não estiver no cache, consulte o banco de dados
        const data = await Game.findOne({ name: { $regex: new RegExp(`^${nameTratad}$`, 'i') } });

        if (data) {
            // Se os dados foram encontrados no banco de dados, armazene no cache por 10 minutos
            cache.put(nameTratad, data, 2 * 60 * 60 * 1000); //2h de cache
            console.log('------------------------------------------')
            console.log('Consultado database e salvo em cache!')
            console.log('------------------------------------------')
            res.render('game', { data: data });
        } else {
            res.status(404).json({ msg: "Não encontrado!" });
        }


    }catch(err){
        res.status(500).send('Erro ao carregar a pagina!')
    }
});



module.exports = router;