const express = require('express')
const path = require('path')
const app = express()


const injectSpeedInsights = require("@vercel/speed-insights")

require("dotenv").config(); 
require('./connect/MongoDB.js')

app.set('view engine', 'ejs')

const routes = require(__dirname + '/router/index.js')
app.use('/', routes);
app.use(express.static(path.join(__dirname, 'public')));

//ao remover este console.log(tudo para)
console.log('Caminho das visualizações:', path.join(process.cwd(), 'views'));


// Middleware para configurar a política de permissões
app.use((req, res, next) => {
  res.setHeader('Set-Cookie', 'cookieName=cookieValue; SameSite=None; Secure');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), interest-cohort=(), sync-xhr=(), storage=(* "self")');
  next();
});


// Middleware para redirecionamento
app.use((req, res, next) => {
  // Verifica se a URL é diferente de https://www.playtorrent.com.br/
  if (req.originalUrl !== '/' && req.originalUrl !== '/download' && req.originalUrl !== '/download/' && req.originalUrl !== '/analytics') {
    // Redireciona para https://www.playtorrent.com.br/download/ + restante da URL
    return res.redirect(`https://www.playtorrent.com.br/download${req.originalUrl}`);
  }
  // Se a URL for https://www.playtorrent.com.br/ ou /download, continua para o próximo middleware
  next();
});

  

// Middleware para lidar com rotas inexistentes
app.use((req, res) => {
  res.status(404).render('404');
});


// Rota para o sitemap.xml
const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.sendFile(sitemapPath);
});


// Rota para o robots.txt
const robotsPath = path.join(__dirname, 'public', 'robots.txt');
app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.sendFile(robotsPath);
});


app.listen(3000, ()=>{
  console.log('http://localhost:3000')
})