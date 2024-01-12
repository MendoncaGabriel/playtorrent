
const express = require('express');
const router = express.Router();
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

async function TopViewr(){
    try {
        const data = await Game.find().lean()
        .sort({ views: -1 }) // Ordena as views do maior para o menor
        .limit(10); // Limita a busca a 10 documentos
        return data
    } catch (error) {
        console.log('Erro ao caregar topViews :' + data)
    }
}

async function Recomendation(generoDaPaginaAtual, nomeDoJogo){
    try {
        console.log(nomeDoJogo);

        const data = await Game.find({
            "class": { $in: generoDaPaginaAtual }
        }).limit(11);

        if (data) {
            // Encontrar e remover o jogo com o mesmo nome da lista
            const filteredData = data.filter(jogo => jogo.name !== nomeDoJogo);
            return filteredData;
        }
    } catch (error) {
        console.log('Erro ao caregar Recomendation :' + data)
    }
}

async function TopDownload(){
    try {
        const data = await Game.find().lean()
        .sort({ download: -1 }) // Ordena as views do maior para o menor
        .limit(10); // Limita a busca a 10 documentos
        return data
    } catch (error) {
        console.log('Erro ao caregar topDownload :' + data)
    }
}


//Rotas de paginas--------------------------------------------------------
router.get('/', async (req, res) => {
    try {
        const cacheKey = req.originalUrl || req.url;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            const { data, topViewr, topDownload } = cachedData;
            if (!data && !topViewr && !topDownload) {
                console.error('Dados ausentes ou inválidos no cache.');
                return res.status(500).send('Erro interno do servidor');
            }

            console.log('Página com cache!');
            return res.render('home', { data, topViewr, topDownload });
        }

        const [data, topViewr, topDownload] = await Promise.all([
            Game.find().skip(0 * 20).limit(20).lean(),
            TopViewr(),
            TopDownload()
        ]);

        if (!data) {
            return res.status(404).render('404', { msg: 'Erro interno do servidor' });
        }

        cache.put(cacheKey, { data, topViewr, topDownload }, cacheTime);
        console.log('Sem cache, consultando banco de dados e cacheando...');

        res.render('home', { title: 'Home', data, page: 0, topViewr, topDownload });
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        return res.status(500).render('500', { msg: 'Erro interno do servidor' });
    }
});

router.get('/page/:pg', async (req, res) => {
    try {
        const pg = req.params.pg;
        const pageSize = 20;
        const cacheKey = req.originalUrl || req.url;

        // Check if data is already in the cache
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            console.log('CACHE')
            // Data is available in the cache, use it
            const { title, data, page } = cachedData;
            return res.render('page', { title, data, page });
        }
        console.log('NO CACHE')

        // Data is not in the cache, fetch it from the database
        const data = await Game.find().skip(pg * pageSize).limit(pageSize);

        // Store the data in the cache for future use
        cache.put(cacheKey, { title: 'Home', data, page: pg }, cacheTime);

        // Render the page with the fetched data
        res.render('page', { title: 'Home', data, page: pg });

    } catch (error) {
        console.error(error);
        return res.status(404).render('404', { msg: 'Erro na pagina!' });
    }
});


router.get('/download/:name', async (req, res) => {
    
    try {
        const nameTratado = req.params.name.replace(/-/g, ' ');
        const cachedData = cache.get(nameTratado);

        if (cachedData) {
            console.log('CACHE')
            const { data, recomend } = cachedData;
            res.render('game', { data: data, recomend: recomend });
            
        }
        else{
            console.log('NO CACHE!')
        
            const [data] = await Promise.all([
                Game.findOne({ name: { $regex: new RegExp(`^${nameTratado}$`, 'i') } }).lean(),
            ]);



            if (data) {
                const recomend = await Recomendation(data.class, data.name);
                cache.put(data, recomend); 
                
                res.render('game', { data: data, recomend: recomend });
               
            } else {
                res.status(404).render('404', {msg: "Jogo não encontrado!"});
            }
        }
    } catch (err) {
        console.error(err);
        return  res.status(404).render('404',{msg: "Erro ao carregar a página!"});
  
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

        return  res.status(404).render('404',{msg: 'erro ao buscar game por id!', erro: erro});
    }


  
})

router.get('/genero/:genero/:pg', async (req, res)=>{
    try {
        const genero = req.params.genero;
        const pg = req.params.pg;
        
        if (!genero) {
            return res.status(422).json({ msg: "Sem genero definido" });
        }

        const totalResults = await Game.find({
            "class": { $in: genero }
        }).countDocuments();

        const data = await Game.find({
            "class": { $in: genero }
        }).skip(pg * 20).limit(20);

        const titulo = 'GÊNERO: ' + genero.toUpperCase()
        const n = (totalResults/20).toFixed(0)
        res.render('genero', {data:data, title: titulo, pages: n });

    } catch (erro) {

        return  res.status(404).render('404',{msg: 'erro ao buscar game por id!', erro: erro});
    }
})

router.get('/plataforma/:plataforma/:pg', async (req, res)=>{
    try {
        const plataforma = req.params.plataforma;
        const pg = req.params.pg;
        
        if (!plataforma) {
            return res.status(422).json({ msg: "Sem plataforma definido" });
        }

        const totalResults = await Game.find({
            "platform": { $in: plataforma }
        }).countDocuments();

        const data = await Game.find({
            "platform": { $in: plataforma }
        }).skip(pg * 20).limit(20)

        const titulo = 'PLATAFORMA: ' + plataforma.toUpperCase()
        const n = (totalResults/20).toFixed(0)
        res.render('plataforma', {data:data, title: titulo, pages: n});

    } catch (erro) {

        return  res.status(404).render('404',{msg: 'erro ao buscar game por id!', erro: erro});
    }
})



//autenticação
router.get('/auth/entrar', async (req, res) => {
    try {
    
        res.render('login');
    } catch (error) {
        console.error('Erro: ' + error);
        res.render('404');
       
    }
});

router.get('/auth/registrar', async (req, res) => {
    try {
    
        res.render('register');
    } catch (error) {
        console.error('Erro: ' + error);
        res.render('404');
       
    }
});


// Rota para obter jogos com pelo menos um comentário
router.get('/comentarios', async (req, res) => {
    try {
        // Encontrar jogos que tenham pelo menos um comentário
        const jogosComComentarios = await Game.find({ comments: { $exists: true, $not: { $size: 0 } } });

        // Retornar a lista de jogos
        res.render('comentarios', {array: jogosComComentarios});
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar jogos com comentários' });
    }
});




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
        return  res.status(500).render('404',{msg: 'Erro no teste de imagem: ' + error});
    }
})




router.get('/topDownloads', async (req, res)=>{
    try {
        const cacheKey = req.originalUrl || req.url;
        const cachedData = cache.get(cacheKey);

        if(cachedData){
            const { data } = cachedData;
            console.log('topDownloads com cache')
            res.status(200).json(data)
        }else{
            console.log('topDownloads sem cache')
            const data = await Game.find()
            .sort({ download: -1 }) 
            .limit(10); 
            
            cache.put(cacheKey, { data }, cacheTime);
            res.status(200).json(data)
        }
        

    } catch (error) {
        res.status(404).json({msg: 'Erro ao caregar topDownloads :' + data})
    }
})



module.exports = router;