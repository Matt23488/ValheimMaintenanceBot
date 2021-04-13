const config = require('../../config');
const { getServerIpAddress } = require('../../ip');
const { formatMilliseconds } = require('../../utilities');
const valheimServer = require('../valheimServer');

module.exports = {
    prefix: 'status',

    /**
     * 
     * @param {string} data 
     * @returns {Promise<{status: string, statuses: any, name: string, ip: string, connectedPlayers: { name: string, uptime: string }, uptime: string, activeUptime: string }>}
     */
    execute: function (data) {
        return Promise.resolve({
            status: valheimServer.getStatus(),
            statuses: valheimServer.statuses,
            name: config.valheim.name,
            ip: `${getServerIpAddress()}:${config.valheim.port}`,
            connectedPlayers: valheimServer.getPlayers().map(p => { return { name: p.name, uptime: formatMilliseconds(p.stopwatch.read()) }; }),
            uptime: formatMilliseconds(valheimServer.getServerUptime()),
            activeUptime: formatMilliseconds(valheimServer.getServerActiveUptime())
        });
    }
};