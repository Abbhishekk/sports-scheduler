const express = require('express');
const path = require('path')
const app = express();
const {sports, session }= require("./models");
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
    response.render('createsport',{
        sportcreated: false
    })
})

app.post('/createsport', async (request, response) => {
    try {
        console.log(request.body)
        if(!sports.findSportByName(request.body.sport)){
            response.render('createsport',{
                sportcreated: true
            })
        }
        else{
            const sport = await sports.createsports({sport: request.body.sport});
        const allSessions = await session.getSessions({sportname: sport.sport_name});
        console.log(sport.id);
        response.render('sportsessions',{
            user: "admin",
            name: request.body.sport,
            sportID : sport.id,
            allSessions
        });
        }
        
    } catch (error) {
        console.log(error);
    }
})
app.get('/sportsession',async (request, response) => {
    console.log(request.body.id);
    const sport = await sports.getSports();
    //console.log(sport)
    //const allSessions = await session.getSessions(sport.sport_name);
    response.render('sportsessions',{
        user: "admin",
        name: sport.sport_name,
        sportID : sport.id,
    
    });
})
app.get('/sportsession/:id/:user',async (request, response) => {
    console.log(request.params.id);
    const sport = await sports.findSportById(request.params.id);
    console.log(sport);
    const allSessions = await session.getSessions({ sportname: sport.sport_name});
    response.render('sportsessions',{
        user: request.params.user,
        name: sport.sport_name,
        sportID : sport.id,
        allSessions
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
app.get('/createsession/:id', (request, response) => {
    
    response.render('createsession',{
        sportId: request.params.id
    })
})
app.post('/createsession',async (request, response) => {
    var playerArray = request.body.playername.split(',');
    const sportname = await sports.findSportById(request.body.sportname);
    try {
        console.log(session)
        const sessions = await session.addSession({
        sportname:sportname.sport_name,
        dateTime: request.body.dateTime,
        address: request.body.address,
        players: playerArray,
        noplayers: request.body.noPlayer,
        sessioncreated: true
    });
    
    const allSessions = await session.getSessions({ sportname: sportname.sport_name});
    response.render('sportsessions',{
        user: request.params.user,
        name: sportname.sport_name,
        sportID : sportname.id,
        allSessions
    });
    } catch (error) {
        console.log(error)
    } 
    
})

app.get('/session/:id', async (request, response) => {
    const allSessions = await session.getSessionById(request.params.id);
    response.render('session',{
        allSessions
    })
})

module.exports = app