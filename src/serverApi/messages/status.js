const config = require('../../config');
const { getServerIpAddress } = require('../../ip');
const valheimServer = require('../valheimServer');
const wsServer = require('../wsServer');

/**
 * @type {{ isRunning: boolean, name: string, ip: string, connectedPlayers: string[] }}
 */

module.exports = {
    prefix: 'status',

    /**
     * 
     * @param {number} requestId
     * @param {string} data 
     * @returns {string}
     */
    execute: function (requestId, data) {
        const statusInfo = {
            isRunning: valheimServer.getStatus() === valheimServer.statuses.ready,
            name: config.valheim.name,
            ip: `${getServerIpAddress()}:${config.valheim.port}`,
            connectedPlayers: valheimServer.connectedPlayers.map(p => p.name)
        };

        wsServer.sendMessage('status', statusInfo, requestId);
    }
};