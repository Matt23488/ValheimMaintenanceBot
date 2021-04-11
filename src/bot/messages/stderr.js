const config = require('../../config');
const discordBot = require('../discord/bot');

module.exports =  {
    /**
     * 
     * @param {string} data 
     */
    execute: function (data) {
        discordBot.getClient().channels.cache.get(config.defaultChannel).send(`The Valheim Server reported an error:\n\`\`\`${data}\`\`\``);
    }
};