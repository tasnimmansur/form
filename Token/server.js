var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var apiRoutes   = express.Router();

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config');
var User   = require('./app/models/user');


var port = process.env.PORT || 8098;
mongoose.connect(config.database);
app.set('superSecret', config.secret); // secret variable

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.get('/setup', function(req, res) {

    // create a sample user
    var lanet = new User({
        name: 'Lanetteam',
        password: 'lanetteam1',
        admin: true
    });

    // save the sample user
    lanet.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});

apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/users', function(req, res) { //Display All Users
    User.find({}, function(err, users) {
        res.json(users);
    });
});

apiRoutes.post('/authenticate', function(req, res) {// Check the User
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.'});
            } else {
                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'));
                    //expiresInMinutes: 1440 // expires in 24 hours
                //});
                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Token!',
                    token: token
                });
            }

        }

    });
});


app.use('/api', apiRoutes);

app.listen(port);
console.log('Application running at http://localhost:' + port);