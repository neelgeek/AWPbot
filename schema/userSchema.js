const mongoose = require("mongoose");

module.exports = mongoose.Schema({
    chatId: {
        type: String
    },
    username: {
        type: String
    }
});