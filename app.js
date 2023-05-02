const express = require('express');
const path = require('path')
const app = express();
const {sports, session }= require("./models");
const bodyParser = require('body-parser');
var cookieparser = require('cookie-parser');
const passport = require('passport');
const ConnectEnsureLogin = require('connect-ensure-login');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt')

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser("shh! some secret string"));
app.set("view engine", "ejs");

app.use(
    session({
      secret: "My-secret-key-1515464651315646115316",
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        //passReqToCallback : true
      },
      (username, password, done) => {
        console.log("finding user...");
        user
          .findOne({
            where: {
              email: username,
            },
          })
          .then(async (users) => {
            //console.log("user found")
            if(users){
              console.log("user found")
              const result = await bcrypt.compare(password, users.password);
              if (result) {
                return done(null, users);
              } else {
                return done(null, false, { message: "Invalid Password " });
              }
            }
            else{
              return done(null,false, {message : "Email not registered"})
            }
          })
          .catch((error) => {
            console.log("Authentication failed");
            return done(error);
          });
      }
    )
  );
  
  const salRounds = 10;
  
  passport.serializeUser((users, done) => {
    console.log("Serializing user in session : ", users.id);
    done(null, users.id);
  });
  
  passport.deserializeUser((id, done) => {
    console.log("deserializing user from session: ", id);
    user
      .findByPk(id)
      .then((users) => {
        done(null, users);
      })
      .catch((err) => {
        done(err, null);
      });
  });

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
app.get('/createsession/:id/:user', (request, response) => {
    
    response.render('createsession',{
        sportId: request.params.id,
        user: request.params.user
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
    response.redirect(`/sportsession/${sportname.id}/${request.body.user}`);
    } catch (error) {
        console.log(error)
    } 
    
})

app.get('/session/:id/:user', async (request, response) => {
    const allSessions = await session.getSessionById(request.params.id);
    response.render('session',{
        allSessions,
        user: request.params.user
    })
})

app.put('/session/:playername/:id',async (request,response) => {
    const sessions = await session.findByPk(request.params.id);
    console.log(session)
    try {
        const updatedplayer = await session.removePlayer(request.params.playername,request.params.id);
        return response.json(updatedplayer);
      } catch (error) {
        console.log(error);
        return response.status(422).json(error);
      }
})

app.put('/cancelsession',async  (request, response) => {
    try {
        const canceledSession = await session.cancelSession(request.body.id);
        const sportId = await sports.findAll({
            where: {
                sport_name: request.body.sportname
            }
        });
        console.log(sportId[0].id);
        response.send({canceledSession,sportId});
    } catch (error) {
        console.log(error);
    }
})

module.exports = app