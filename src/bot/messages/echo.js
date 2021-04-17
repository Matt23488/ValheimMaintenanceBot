const Discord = require('discord.js');
const config = require('../../config');
const discordBot = require('../discord/bot');
const say = require('say');
const { set } = require('lodash');
const fs = require('fs');

module.exports =  {
    /**
     * 
     * @param {string} data 
     */
    execute: function (data) {
        discordBot.getClient().channels.cache.get(config.defaultChannel).send(data);
        // say.speak(data, 'Microsoft Zira Desktop');
        // say.getInstalledVoices(console.log);

        /**
         * @type {Discord.VoiceChannel}
         */
        const voice = discordBot.getClient().channels.cache.get(config.defaultVoiceChannel);
        voice.join().then(connection => {
            say.export(data, null, null, 'test.wav', err => {
                const dispatcher = connection.play('test.wav');

                dispatcher.on('start', () => {
                    console.log(`saying '${data}'`);
                });

                dispatcher.on('finish', () => {
                    console.log('done');
                    connection.disconnect();
                    fs.unlinkSync('test.wav');
                });

                dispatcher.on('error', console.error);

            });
        });
    }
};