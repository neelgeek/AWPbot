if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
var cron = require('node-cron');
const mongoose = require('mongoose');
const redditFetcher = require('./model/RedditHandler');
const AWPBot = require('./model/TelegramBotHandler');
const http = require('http');

var port = process.env.PORT || 8080;

http.createServer((req, res) => {
    res.write("Welcome to AWP-Bot");
}).listen(port);
console.log("Running on port " + port);

// Reddit Fetcher 
var rf = new redditFetcher(process.env.SECERT, process.env.REFRESH)

// Telegram Bot
var bot = new AWPBot(process.env.BOT_TOKEN, rf)


mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds042607.mlab.com:42607/awp_users`, { useNewUrlParser: true, useUnifiedTopology: true }).then(c => {
    console.log("Connected to Database");
    cron.schedule('* * * * *', function() {
        bot.PostUpdate().then(res => {
            console.log("Post created !")
        });
    })

}).catch(err => {
    throw new Error(e.message());
})

http.createServer().listen(80);