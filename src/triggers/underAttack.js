const config = require("../config");
const { getClient } = require("../discord/bot");

module.exports = {
    searchText: 'Random event set:',

    /**
     * 
     * @param {string} text 
     * @param {number} searchTextIndex 
     * @returns {Promise<void>}
     */
    execute: function (text, searchTextIndex) {
        return new Promise(resolve => {
            const type = text.slice(searchTextIndex + this.searchText.length, text.indexOf('\n')).trim();
    
            // https://valheim.fandom.com/wiki/Events
            let message = '';
            let duration = 0;
            switch (type) {
                // Story events
                case 'army_eikthyr':
                    message = 'Eikthyr rallies the creatures of the forest! Boars and Necks are attacking!';
                    duration = 90;
                    break;
                case 'army_theelder':
                    message = 'The forest is moving... Greydwarfs, Greydwarf Brutes, and Greydwarf Shamans are attacking!';
                    duration = 120;
                    break;
                case 'army_bonemass':
                    message = 'A foul smell from the swamp! Draugar and Skeletons are attacking!';
                    duration = 150;
                    break;
                case 'army_moder':
                    message = 'A cold wind blows from the mountains! It\'s cold and Drakes are attacking!';
                    duration = 150;
                    break;
                case 'army_goblin':
                    message = 'The horde is attacking! Fulings, Fuling Berserkers, and Fuling Shamans! AHHHHHHHHHHHHHHHHHHH!';
                    duration = 120;
                    break;

                // Enemy events
                case 'skeletons':
                    message = 'Skeleton surprise! Skeletons are attacking!';
                    duration = 120;
                    break;
                case 'blobs':
                    message = 'Blobs are attacking!';
                    duration = 120;
                    break;
                case 'foresttrolls':
                    message = 'The ground is shaking! Trolls are attacking!';
                    duration = 80;
                    break;
                case 'wolves':
                    message = 'You are being hunted! Wolves are attacking!';
                    duration = 120;
                    break;
                case 'surtlings':
                    message = 'There\'s a smell of sulfur in the air! Surtlings are attacking!';
                    duration = 120;
                    break;

                default:
                    message = `We're under attack! Dad needs to account for this type: \`${type}\`!`;
                    break;
            }

            const channel = getClient().channels.cache.get(config.defaultChannel);
            channel.send(message);

            setTimeout(() => channel.send('The attack _should_ be over. Thank gods.'), duration * 1000);

            resolve();
        });
    }
};