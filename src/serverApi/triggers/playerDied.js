const config = require("../../config");
const wsServer = require("../wsServer");

const prefix = 'Got character ZDOID from ';

module.exports = {
    /**
     * 
     * @param {string} text 
     * @returns {{ canHandle: boolean, data: string }}
     */
    parse: function (text) {
        if (text.indexOf(prefix) === -1) return { canHandle: false, data: null };

        const prefixIndex = text.indexOf(prefix);
        const firstColon = text.indexOf(':', prefixIndex + prefix.length);
        const secondColon = text.indexOf(':', firstColon + 1);
        const player = {
            id: text.slice(firstColon + 1, secondColon).trim(),
            name: text.slice(prefixIndex + prefix.length, firstColon).trim()
        };

        if (player.id !== '0') return { canHandle: false, data: null };
        return { canHandle: true, data: player.name };
    },

    /**
     * 
     * @param {string} data 
     * @returns {void}
     */
    execute: function (data) {
        if (config.valheim.pickOnUsers.indexOf(data) >= 0) wsServer.sendMessage('echo', `_${data}_ died again. <:joy:831246652173844494>`);
        else wsServer.sendMessage('echo', `Player _${data}_ has died. F in the chat.`);
    }
};
