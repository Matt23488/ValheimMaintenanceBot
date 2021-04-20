const wsServer = require("../wsServer");

const prefix = 'Random event set:';

module.exports = {
    /**
     * 
     * @param {string} text 
     * @returns {{ canHandle: boolean, data: string }}
     */
    parse: function (text) {
        const prefixIndex = text.indexOf(prefix);
        if (prefixIndex === -1) return { canHandle: false, data: null };

        const data = text.slice(prefixIndex + prefix.length, text.indexOf('\n')).trim();
        wsServer.sendMessage('echo', `\`\`\`\nDEBUG\ntext: ${text}\nprefixIndex: ${prefixIndex}\ndata: ${data}\`\`\``);
        return { canHandle: true, data };
    },

    /**
     * 
     * @param {string} data
     * @returns {void}
     */
    execute: function (data) {
        wsServer.sendMessage('underAttack', data);
    }
};