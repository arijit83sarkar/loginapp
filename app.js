const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const expressValidator = require('express-validator');
const connectFlash = require('connect-flash');
const expressSession = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');

const routes = require('./routes/index');
const users = require('./routes/users');

// DB config
require('./config/db');

// init app
var app = express();

// view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

// bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// express session
app.use(expressSession({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// init passport
app.use(passport.initialize());
app.use(passport.session());

// exoress validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.');
        var root = namespace.shift();
        var formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// connect flash
app.use(connectFlash());

// global vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', routes);
app.use('/users', users);

// set port
app.set('port', (process.env.PORT || 3001));
// start server
app.listen(app.get('port'), function (err) {
    console.log('Server is running on ' + app.get('port'));
});