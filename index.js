const express = require('express');
const path = require('path');
const app = express();
require("dotenv").config(); 
require('./connect/MongoDB.js');
const Game = require('./model/gameSchema.js');

//Portas e Caminhos
const PORT = 3000;
const VIEWS_PATH = path.join(process.cwd(), 'views');
const PUBLIC_PATH = path.join(__dirname, 'public');
const SITEMAP_PATH = path.join(PUBLIC_PATH, 'sitemap.xml');
const ROBOTS_PATH = path.join(PUBLIC_PATH, 'robots.txt');

// configurações
app.set('timeout', 10000); // Define tempo máximo de carregamento em 10s // Importante!
app.set('view engine', 'ejs');
app.set('views', VIEWS_PATH);
app.use(express.static(PUBLIC_PATH));




//rotas
const routesPages = require('./router/pages.js');
app.use('/', routesPages);


//rotas-------------
app.patch('/downloadCont/:id', async (req, res) => {
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


// Rota para o sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.sendFile(SITEMAP_PATH);
});


// Rota para o robots.txt
app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.sendFile(ROBOTS_PATH);
});


// Middleware para configurar a política de permissões
app.use((req, res, next) => {
  res.setHeader('Set-Cookie', 'cookieName=cookieValue; SameSite=None; Secure');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), interest-cohort=(), sync-xhr=(), storage=(* "self")');
  next();
});




// Middleware para lidar com rotas não encontradas
app.use((req, res) => {
  return res.status(404).render('404');
});


app.listen(PORT, ()=>{
  console.log('http://localhost:3000')
})