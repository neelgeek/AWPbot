const Mongoose = require("mongoose");
const Telegraf = require('telegraf');
const userSchema = require('../schema/userSchema');

class AWPBot {
    constructor(token, redditHandler) {
        this.userModel = new Mongoose.model("user", userSchema);
        this.redditHandler = redditHandler;
        this.bot = new Telegraf(token);

        this.bot.startPolling();
        this.bot.start((ctx) => {
            var cId = ctx.update.message.chat.id;
            var uname = ctx.update.message.chat.username;
            this.userModel.findOneAndUpdate({ chatId: cId }, { chatId: cId, username: uname }, { upsert: true, new: true, setDefaultsOnInsert: true }).then(r => {
                ctx.reply(`Sucesfully Registered this Chat with AWP Bot`);
                // this.redditHandler.GetFormattedPost().then(post => {
                //     this.SendIndivisual(cId, post);
                // })
            }).catch(e => {
                console.error(e);
                ctx.reply(`Some Error occured while registering you,please try again`);
            })
        })
    }

    PostUpdate() {
        return this.userModel.find({}, { _id: 0, chatId: 1 }).then(result => {
            return this.redditHandler.GetFormattedPost().then(post => {
                var promises = Array();
                result.forEach(user => {
                    promises.push(this.bot.telegram.sendMessage(user.chatId, post, { parse_mode: 'Markdown' }));
                });

                return Promise.all(promises);
            })

        })
    }

    SendIndivisual(id, message) {
        this.bot.telegram.sendMessage(id, message, { parse_mode: 'Markdown' });
    }

}
module.exports = AWPBot;