const valheimServer = require("../valheimServer");
const wsServer = require("../wsServer");

function getPlayerCountMessage() {
    return `There ${valheimServer.connectedPlayers.length === 1 ? 'is' : 'are'} currently ${valheimServer.connectedPlayers.length} player${valheimServer.connectedPlayers.length === 1 ? '' : 's'} on the server.`;
}

const prefix = 'Destroying abandoned non persistent zdo ';

module.exports = {
    /**
     * 
     * @param {string} text 
     * @returns {{ canHandle: boolean, data: string }}
     */
    parse: function (text) {
        if (text.indexOf(prefix) === -1) return { canHandle: false, data: null };

        const prefixIndex = text.indexOf(prefix);
        const colon = text.indexOf(':', prefixIndex + prefix.length);
        const id = text.slice(prefixIndex + prefix.length, colon).trim();
        const player = valheimServer.connectedPlayers.find(p => p.id === id);
        if (!player) return { canHandle: false, data: null };

        return { canHandle: true, data: player };
    },

    /**
     * 
     * @param {{ id: string, name: string }} data 
     * @returns {void}
     */
    execute: function (data) {
        valheimServer.connectedPlayers = valheimServer.connectedPlayers.filter(p => p.id !== data.id);
        wsServer.sendMessage('echo', `Player \`${data.name}\` has left the server. ${getPlayerCountMessage()}`);
    }
};