const express = require('express')
const path = require('path')
const app = express()



require("dotenv").config(); 
require('./connect/MongoDB.js')

app.set('view engine', 'ejs')

const routes = require(__dirname + '/router/index.js')
app.use('/', routes);
app.use(express.static(path.join(__dirname, 'public')));
// app.set('views', path.join(process.cwd(), 'views'));
console.log('Caminho das visualizações:', path.join(process.cwd(), 'views'));

// Configurar Content Security Policy (CSP)
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self' https: data: blob:; connect-src 'self' https: www.youtube.com");
    next();
});


app.use((req, res) => {
    res.status(404).render('404')
});



app.listen(3000, ()=>{
    console.log('http://localhost:3000')
})