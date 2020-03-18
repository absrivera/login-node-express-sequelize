//Module import statements 
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const app = express();
const port = 3000;
const path = require('path');
const session = require('express-session');

//route module imports 
const createUser = require('./API/createUser');
const getUsers = require('./API/getUsers');
const authenticate = require('./API/authenticate');

//bodyparser middleware config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//alternative to JWT, express-session is a simplistic session middleware 
app.use(session({ secret: "It's a secret" }));


//models - represent tables in the db
const User = require('./models/user');


//css route
app.get('/css/custom.css', (req, res) => { res.sendDate(path.join(__dirname + '/css/custom.css')) });

//View Routes
app.get('/', (req, res) => { return res.sendFile(path.join(__dirname + '/views/login.html')) });
app.get('/register', (req, res) => { return res.sendFile(path.join(__dirname + '/views/create.html')) });
app.get('/members', (req, res) => {
    if (session.authenticated === true) {
        return res.sendFile(path.join(__dirname + '/views/members.html'));
    } else {
        res.redirect(301, '/');
    }

});


//view-model paths
app.post('/', (req, res) => {
    authenticate(req, res, User, session, (response) => {
        if (response === 'error') {
            res.status(500).sendFile(path.join(__dirname + '/views/login.html'))
        } else if (response === 'noauth') {
            res.status(401).sendFile(path.join(__dirname + '/views/login.html'))
        } else {
            res.sendFile(path.join(__dirname + '/views/members.html'))
        }
    })

});

app.post('/register', (req, res) => {
    createUser(req, res, User, (response) => {
        if (response !== 'error') {
            res.sendFile(path.join(__dirname + '/views/members.html'))
        } else {
            res.sendFile(path.join(__dirname + '/views/login.html'))
        }
    })
});

app.post('/logout', (req, res) => {
    session.authenticated = false;
    res.redirect(301, '/');
})

//API routes
app.post('/user', (req, res) => {
    createUser(req, res, User)
        .then(dbRes => {
            console.log(dbRes.toJSON());
            res.send(dbRes.toJSON());
        }).catch(err => {
            if (err) {
                res.send(err);
                throw (err);
            }

        });
});

app.get('/users', (req, res) => { getUsers(req, res, User) });

//{force: true} is what makes the DB data not persist
sequelize.sync()
    .then(() => {
        app.listen(port, () => {
            console.log("Application running on " + port);
        });
    })

//closes stream once application/node is terminated
process.on('SIGTERM', () => {
    app.close(() => {
        db.end();
    });

    setTimeout(() => {
        console.log("Couldn't close connections in time, forcefully shutting down db connection")
        process.exit(1);
    }, 30 * 1000);

});
