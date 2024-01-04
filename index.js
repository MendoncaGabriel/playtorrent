const express = require('express')
const path = require('path')
const app = express()

require("dotenv").config(); 
require('./connect/MongoDB.js')

app.set('view engine', 'ejs')

const routes = require(__dirname + '/router/index.js')
app.set('timeout', 10000); //definie tempo maximo de carregamento em 10s //important!
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