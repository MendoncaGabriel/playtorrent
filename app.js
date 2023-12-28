const express = require('express')
const path = require('path')
const app = express()
require("dotenv").config(); 
require('./connect/MongoDB.js')

//registrar o templete engine 
app.set('view engine', 'ejs')
//app.set('views', 'src/views') //procurar ejs dentro da pasta novapasta

const routes = require(__dirname + '/router/index.js')
app.use('/', routes);
app.use(express.static(path.join(__dirname, 'public')))



app.use((req, res) => {
    res.status(404).render('404')
});

app.listen(3000, ()=>{
    console.log('http://localhost:3000')
})