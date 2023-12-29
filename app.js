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

console.log('Caminho das visualizações:', path.join(process.cwd(), 'views'));

// Configurar Content Security Policy (CSP)
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self' https: data: blob:; connect-src 'self' https: www.youtube.com");
    next();
});

app.use((req, res) => {
    res.status(404).render('404')
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