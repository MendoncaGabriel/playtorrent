const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const expressSanitizer = require('express-sanitizer');

const server = http.createServer(app);
require("dotenv").config(); 
require('./connect/MongoDB.js');
const Game = require('./model/gameSchema.js');
 

//Portas e Caminhos
const PORT = process.env.PORT || 3000;
const VIEWS_PATH = path.join(process.cwd(), '/src/views');
const PUBLIC_PATH = path.join(__dirname, 'public');
const SITEMAP_PATH = path.join(PUBLIC_PATH, 'sitemap.xml');
const ROBOTS_PATH = path.join(PUBLIC_PATH, 'robots.txt');


// configurações
server.timeout = 60000
app.set('view engine', 'ejs');
app.set('views', VIEWS_PATH);
app.use(express.static(PUBLIC_PATH));
app.use(express.json());
app.use(expressSanitizer());





//rotas
const routesPages = require('./router/pages.js');
const services = require('./router/services.js')
const auth = require('./router/auth.js')
app.use('/', routesPages);
app.use('/services', services);
app.use('/authentication', auth)





//rotas-------------
app.patch('/downloadCont/:id', async (req, res) => {
  try {
      const id = req.params.id;
      const game = await Game.findById(id).lean();

      if (!game) {
          return res.status(404).json({ msg: 'Jogo não encontrado' });
      }

      const update = { $inc: { download: 1 } };

      // Se `download` não existe, não tente definir diretamente
      // o MongoDB cuidará disso automaticamente com `$inc`
      
      const newUpdate = await Game.findByIdAndUpdate(id, update, { new: true }).lean();

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



app.use((err, req, res, next) => {
  console.error('Erro interno:', err);
  res.status(500).send('Erro interno no servidor');
});


app.listen(PORT, ()=>{
  console.log('http://localhost:3000')
})