const valheimServer = require("../valheimServer");
const wsServer = require("../wsServer");

const prefix = 'Destroying abandoned non persistent zdo ';

module.exports = {
    /**
     * 
     * @param {string} text 
     * @returns {{ canHandle: boolean, data: { id: string, name: string } }}
     */
    parse: function (text) {
        if (text.indexOf(prefix) === -1) return { canHandle: false, data: null };

        const prefixIndex = text.indexOf(prefix);
        const colon = text.indexOf(':', prefixIndex + prefix.length);
        const id = text.slice(prefixIndex + prefix.length, colon).trim();
        const player = valheimServer.findPlayer(id);
        if (!player) return { canHandle: false, data: null };

        return { canHandle: true, data: player };
    },

    /**
     * 
     * @param {{ id: string, name: string }} data 
     * @returns {void}
     */
    execute: function (data) {
        valheimServer.removePlayer(data.id);
        wsServer.sendMessage('playerDisconnected', data.name);
    }
};