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
            // Random event set:foresttrolls (detect these) (army_bonemass is another)
    
            let message = '';
            switch (type) {
                case 'foresttrolls':
                    message = 'The ground is shaking! Trolls are attacking!';
                    break;
                case 'army_bonemass':
                    message = 'There\'s a foul smell from the Swamp! Draugr and Skeletons are attacking!';
                    break;
                default:
                    message = `We're under attack! Dad needs to account for this type: \`${type}\`!`;
                    break;
            }

            getClient().channels.cache.get(config.defaultChannel).send(message);
            resolve();
        });
    }
};