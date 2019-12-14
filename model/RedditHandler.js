const sw = require('snoowrap')
const fs = require('fs');

class redditFetcher {
    constructor(clientSecert, refreshToken) {
        this.redditAPI = new sw({
            userAgent: "Its a Telegram Bot that lists the best wallpaper images from different subreddits on reddit and posts it on a Telegram channel",
            clientId: '0In8W9N-YgEXvg',
            clientSecret: clientSecert,
            refreshToken: refreshToken
        });
    }

    GetTopPost() {
        var topPost = null
        return this.redditAPI.getSubreddit('wallpaper').getTop({
            count: 1,
            time: "day"
        }).then(r => {
            return r[0];
        }).catch(e => {
            throw new Error(e.message());
        });
    }

    GetFormattedPost() {
        return this.GetTopPost().then(post => {
            post =
                `*${post.title}*

${post.url}

[Rate the Channel](https://t.me/dailychannelsbot?start=awesomewallp)`
            return post
        })
    }
}
module.exports = redditFetcher;