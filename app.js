const express = require('express');
const path = require('path')
const app = express();
const {sports }= require("./models");
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
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

app.get('/admin',async (request, response) => {  
    const allSports = await sports.getSports();
    response.render('useradmin',{
        allSports
    })
})

app.get('/user', async (request, response) => {
    const allSports = await sports.getSports();
    response.render('player',{
        allSports
    });
})

app.get('/createsport', (request, response) => {
    response.render('createsport')
})

app.post('/createsport', async (request, response) => {
    try {
        console.log(request.body)
        const sport = await sports.createsports({sport: request.body.sport});
        console.log(sport.id);
        response.render('sportsessions',{
            user: "admin",
            name: request.body.sport,
            sportID : sport.id
        });
    } catch (error) {
        console.log(error);
    }
})
app.get('/sportsession',async (request, response) => {
    console.log(request.body.id);
    const sport = await sports.getSports();
    response.render('sportsessions',{
        user: "admin",
        name: sport.sport_name,
        sportID : sport.id
    });
})
app.get('/sportsession/:id/:user',async (request, response) => {
    console.log(request.params.id);
    const sport = await sports.findSportById(request.params.id);
    response.render('sportsessions',{
        user: request.params.user,
        name: sport.sport_name,
        sportID : sport.id
    });
})

app.delete(`/sportsession/:id`,async (request, response) => {
    console.log("We have to delete a Todo with ID: ", request.params.id);
    // FILL IN YOUR CODE HERE

    try {
      const deleteTodo = await sports.destroy({
        where: {
          id: request.params.id,
        },
      });
      return response.send(deleteTodo ? true : false);
    } catch (error) {
      console.log(error);
      return response.status(422).send(error);
    }
})
app.get('/createsession', (request, response) => {
    response.render('createsession')
})
app.post('/createsession',async (request, response) => {
    
})

module.exports = app