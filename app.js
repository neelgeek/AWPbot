if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const mongoose = require('mongoose');
const redditFetcher = require('./model/RedditHandler');
const AWPBot = require('./model/TelegramBotHandler');

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds042607.mlab.com:42607/awp_users`, { useNewUrlParser: true, useUnifiedTopology: true }).then(c => {
    console.log("Connected to Database");
}).catch(err => {
    throw new Error(e.message());
})


// Reddit Fetcher 
var rf = new redditFetcher(process.env.SECERT, process.env.REFRESH)

// Telegram Bot
var bot = new AWPBot(process.env.BOT_TOKEN, rf)
bot.PostUpdate();