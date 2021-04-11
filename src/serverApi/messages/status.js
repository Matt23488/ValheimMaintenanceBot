const config = require('../../config');
const { getServerIpAddress } = require('../../ip');
const { formatMilliseconds } = require('../../utilities');
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
            connectedPlayers: valheimServer.connectedPlayers.map(p => { return { name: p.name, uptime: formatMilliseconds(p.stopwatch.read()) }; }),
            uptime: formatMilliseconds(valheimServer.getServerUptime())
        };

        wsServer.sendResponse(requestId, 'status', statusInfo);
    }
};