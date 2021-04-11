const valheimServer = require('../valheimServer');
const wsServer = require('../wsServer');

module.exports = {
    prefix: 'shutdown',

    /**
     * 
     * @param {number} requestId
     * @param {string} data 
     * @returns {string}
     */
    execute: function (requestId, data) {
        valheimServer.stop().then(() => {
            wsServer.sendResponse(requestId, 'shutdown');
            wsServer.getServer().close();
            process.exit();
        });
    }
};