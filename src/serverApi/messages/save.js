const fs = require('fs');
const path = require('path');
const valheimServer = require('../valheimServer');
const wsServer = require('../wsServer');

module.exports = {
    prefix: 'save',

    /**
     * 
     * @param {{ name: string, outFileName: string, author: string }} data 
     * @returns {Promise<string>}
     */
    execute: function (data) {
        const buffer = valheimServer.getBuffer(data.name);
        if (!buffer) {
            return Promise.resolve(null);
        }

        const output = buffer.toArray().join('\n');
        if (data.outFileName) fs.writeFileSync(path.join(__dirname, `../../../logs/${data.author}_${data.outFileName}.txt`), output);
        return Promise.resolve(output);
    }
};