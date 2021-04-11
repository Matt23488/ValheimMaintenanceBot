const config = require('../../config');
const discordBot = require('../discord/bot');

module.exports =  {
    /**
     * 
     * @param {{ type: string, message: string }} data 
     */
    execute: function (data) {
        const channel = discordBot.getClient().channels.cache.get(config.defaultChannel);
        channel.send(data.message);

        switch (data.type) {
            case 'foresttrolls':
                channel.send({
                    files: [ 'https://cdn.discordapp.com/attachments/347519580610232320/830267128799821874/troll-hunter-gif-3.gif' ]
                });
                break;
        }
    }
};