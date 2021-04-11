const { spawn } = require('child_process');
const config = require('../../config');
const { getServerIpAddress } = require('../../ip');
const valheimServer = require('../valheimServer');
const wsServer = require('../wsServer');

module.exports = {
    prefix: 'start',

    /**
     * 
     * @param {number} requestId
     * @param {string} data 
     * @returns {string}
     */
    execute: function (requestId, data) {
        if (valheimServer.getStatus() !== valheimServer.statuses.stopped) {
            wsServer.sendResponse(requestId, 'echo', `The server is already running at \`${getServerIpAddress()}:${config.valheim.port}\`.`);
            return;
        }

        valheimServer.start();
        wsServer.sendResponse(requestId, 'echo', 'Starting server...');
    }
};