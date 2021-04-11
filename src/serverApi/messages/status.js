const config = require('../../config');
const { getServerIpAddress } = require('../../ip');
const valheimServer = require('../valheimServer');
const wsServer = require('../wsServer');

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
            status: valheimServer.getStatus(),
            statuses: valheimServer.statuses,
            name: config.valheim.name,
            ip: `${getServerIpAddress()}:${config.valheim.port}`,
            connectedPlayers: valheimServer.connectedPlayers.map(p => { return { name: p.name, uptime: p.stopwatch.read() }; }),
            uptime: valheimServer.getServerUptime()
        };

        wsServer.sendResponse(requestId, 'status', statusInfo);
    }
};