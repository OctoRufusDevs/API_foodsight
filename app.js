var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('express-flash');
var session = require('express-session');

var indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const userRouter = require('./routes/test');

const {connect} = require("./config/database.js");

connect();

var app = express();
//var env = require('node-env-file'); // .env file
//env(__dirname + '/gmail.env'); //Para correr localmente crear el archivo gmail.env y añadir las variables
//SENDEREMAIL Y SENDERPASSWORD
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ 
    secret: 'session secret key',
    resave: true,
    saveUninitialized: true 
}));
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/test', userRouter);


module.exports = app;
