const Mongoose = require("mongoose");
const Telegraf = require('telegraf');
const userSchema = require('../schema/userSchema');

class AWPBot {
    constructor(token, mongoose) {
        // this.mongoose = mongoose
        this.userModel = new Mongoose.model("user", userSchema);

        this.bot = new Telegraf(token);
        this.bot.startPolling();


        this.bot.start((ctx) => {
            var cId = ctx.update.message.chat.id;
            var uname = ctx.update.message.chat.username;
            this.userModel.findOneAndUpdate({ chatId: cId }, { chatId: cId, username: uname }, { upsert: true, new: true, setDefaultsOnInsert: true }).then(r => {
                ctx.reply(`Sucesfully Registered this Chat with AWP Bot`);
            }).catch(e => {
                ctx.reply(`Some Error occured while registering you,please try again`);
            })
        })
    }





}

module.exports = AWPBot;