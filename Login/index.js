var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var hat = require('hat');
var salt = bcrypt.genSaltSync(10);

mongoose.connect('mongodb://localhost/newdb', function(err, result) {
    if (err) return err;
    console.log('Successfully connected to DB')
});

// create mongoose schema and generate model for users
var UserSchema = new Schema({
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true},
    access_token: { type: String, required: true}
});

var User = mongoose.model('users', UserSchema);

app.use(bodyParser.json());
app.use(cookieParser());

app.post('/sign', function(req,res) {
    var user = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
        access_token: hat()
    };
    User.create(user, function(err) {
        if (err) console.log(err);
        res.cookie('access_token', user.access_token, { maxAge: 900000, httpOnly: true });
        res.send('success');
    });
});

app.post('/login', function(req,res) {
    var user_login = {
        email: req.body.email
    };
    User.findOne(user_login, function(err, user) {
        if (err) console.log(err);
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            user.access_token = hat();
            user.save();
            res.cookie('access_token', user.access_token, { maxAge: 900000, httpOnly: true });
            res.send('successfully logged in');
        }
        else {
            res.send('invalid username and password');
        }
    });
});

app.get('/secret', function(req,res, next) {
    if (!req.cookies.access_token) {
        res.redirect('/');
    }
    User.findOne(req.cookies.access_token, function(err, user) {
        if (err) console.log('error', err);
        if (user) {
            res.sendFile(__dirname + '/secret.html');
        } else {
            res.redirect('/');
        }
    });
});

app.use('/', express.static('client'));

app.listen(3000);
