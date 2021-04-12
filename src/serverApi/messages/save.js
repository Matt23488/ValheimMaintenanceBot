const fs = require('fs');
const path = require('path');
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
        const buffer = valheimServer.getBuffer(data.name);
        if (!buffer) {
            wsServer.sendResponse(requestId, 'save');
            return;
        }

        const output = buffer.toArray().join('\n');
        if (data.outFileName) fs.writeFileSync(path.join(__dirname, `../../../logs/${data.author}_${data.outFileName}.txt`), output);
        wsServer.sendResponse(requestId, 'save', output);
    }
};