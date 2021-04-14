const valheimServer = require("../valheimServer");
const wsServer = require("../wsServer");

const prefix = 'Got character ZDOID from ';

module.exports = {
    /**
     * 
     * @param {string} text 
     * @returns {{ canHandle: boolean, data: { id: string, name: string } }}
     */
    parse: function (text) {
        if (text.indexOf(prefix) === -1) return { canHandle: false, data: null };

        const prefixIndex = text.indexOf(prefix);
        const firstColon = text.indexOf(':', prefixIndex + prefix.length);
        const secondColon = text.indexOf(':', firstColon + 1);
        const newPlayer = {
            id: text.slice(firstColon + 1, secondColon).trim(),
            name: text.slice(prefixIndex + prefix.length, firstColon).trim()
        };

        // Died
        if (newPlayer.id === '0') return { canHandle: false, data: null };

        // Respawned
        const existing = valheimServer.findPlayer(newPlayer.id);
        if (existing) return { canHandle: false, data: null };

        return { canHandle: true, data: newPlayer };
    },

    /**
     * 
     * @param {{ id: string, name: string }} data 
     * @returns {void}
     */
    execute: function (data) {
        valheimServer.addPlayer(data.id, data.name);
        wsServer.sendMessage('playerConnected', data.name);
    }
};