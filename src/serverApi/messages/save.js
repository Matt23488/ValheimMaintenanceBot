const fs = require('fs');
const config = require('../../config');
const { getServerIpAddress } = require('../../ip');
const { formatMilliseconds } = require('../../utilities');
const valheimServer = require('../valheimServer');
const wsServer = require('../wsServer');

module.exports = {
    prefix: 'save',

    /**
     * 
     * @param {number} requestId
     * @param {{ name: string, outFileName: string, author: string }} data 
     */
    execute: function (requestId, data) {
        switch (data.name) {
            case 'stdout':
                const output = valheimServer.stdoutBuffer.toArray().join('\n');
                if (data.outFileName) fs.writeFileSync(path.join(__dirname, `../../../logs/${data.author}_${data.outFileName}.txt`), output);
                wsServer.sendResponse(requestId, 'save', output);
                break;
            default:
                wsServer.sendResponse(requestId, 'save');
                break;
        }

        //         if (params[1].length > 0) fs.writeFileSync(path.join(__dirname, `../../../logs/${message.author.tag}_${params[1]}.txt`), output);



        // const statusInfo = {
        //     status: valheimServer.getStatus(),
        //     statuses: valheimServer.statuses,
        //     name: config.valheim.name,
        //     ip: `${getServerIpAddress()}:${config.valheim.port}`,
        //     connectedPlayers: valheimServer.connectedPlayers.map(p => { return { name: p.name, uptime: formatMilliseconds(p.stopwatch.read()) }; }),
        //     uptime: formatMilliseconds(valheimServer.getServerUptime())
        // };

        // wsServer.sendResponse(requestId, 'status', statusInfo);
    }
};