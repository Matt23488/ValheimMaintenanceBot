const { getServer } = require("../wsServer");
const valheimServer = require("../valheimServer");

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
        const id = dataString.slice(prefixIndex + prefix.length, colon).trim();
        const player = valheimServer.connectedPlayers.find(p => p.id === id);
        if (!player) return { canHandle: false, data: null };

        valheimServer.connectedPlayers = valheimServer.connectedPlayers.filter(p => p.id !== id);
        return { canHandle: true, data: player.name };
    },

    /**
     * 
     * @param {string} data 
     * @returns {void}
     */
    execute: function (data) {
        valheimServer.connectedPlayers.push(data);
        getServer().clients.forEach(ws => {
            ws.send(`echo Player \`${data}\` has left the server. ${getPlayerCountMessage()}`);
        });
    }
};