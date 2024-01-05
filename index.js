const express = require('express');
const path = require('path');
const app = express();
require("dotenv").config(); 
require('./connect/MongoDB.js');

// Configuração do diretório de visualizações
app.set('timeout', 10000); // Define tempo máximo de carregamento em 10s // Importante!
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views')); // Cria um caminho absoluto para o diretório 'views' com base no diretório de trabalho atual do processo Node.js.


//rotas
const routesPages = require(__dirname + '/router/pages.js')
const routesServices = require(__dirname + '/router/services.js')
app.use('/', routesPages);
app.use('/', routesServices);

//definindo pasta publica
app.use(express.static(path.join(__dirname, 'public')));


// Middleware para configurar a política de permissões
app.use((req, res, next) => {
  res.setHeader('Set-Cookie', 'cookieName=cookieValue; SameSite=None; Secure');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), interest-cohort=(), sync-xhr=(), storage=(* "self")');
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