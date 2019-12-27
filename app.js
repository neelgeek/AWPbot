var express = require('express')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

require('dotenv').config()

var cron = require('node-cron');
const mongoose = require('mongoose');
const redditFetcher = require('./model/RedditHandler');
const AWPBot = require('./model/TelegramBotHandler');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Reddit Fetcher 
var rf = new redditFetcher(process.env.SECERT, process.env.REFRESH)

// Telegram Bot
var bot = new AWPBot(process.env.BOT_TOKEN, rf)


mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds042607.mlab.com:42607/awp_users`, { useNewUrlParser: true, useUnifiedTopology: true }).then(c => {
    console.log("Connected to Database");
    cron.schedule('0 12 * * *', function() {
        bot.PostUpdate().then(res => {
            console.log("Post created !")
        });
    })

}).catch(err => {
    throw new Error(e.message());
})

module.exports = app;