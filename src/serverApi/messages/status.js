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
     * @param {string} data 
     * @returns {string}
     */
    execute: function (data) {
        const statusInfo = JSON.stringify({
            isRunning: valheimServer.isRunning(),
            name: config.valheim.name,
            ip: `${getServerIpAddress()}:${config.valheim.port}`,
            connectedPlayers: valheimServer.connectedPlayers.map(p => p.name)
        });

        wsServer.getServer().clients.forEach(ws => {
            ws.send(`status ${statusInfo}`);
        });
    }
};