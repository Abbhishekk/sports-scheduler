const express = require('express');
const path = require('path')
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");


app.get('/',(request, response) =>{
    response.render('index');
});

app.get('/login',(request, response) => {
    response.render('signin');
});
app.get('/signup',(request, response) => {
    response.render('signup');
});

app.get('/admin',(request, response) => {
    response.render('useradmin')
})

app.get('/createsport', (request, response) => {
    response.render('createsport')
})

module.exports = app