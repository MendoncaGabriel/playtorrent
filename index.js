const express = require('express');
const path = require('path');
const app = express();
require("dotenv").config(); 
require('./connect/MongoDB.js');

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
const routesServices = require('./router/services.js');

app.use('/', routesPages);
app.use('/', routesServices);


app.listen(PORT, ()=>{
  console.log('http://localhost:3000')
})