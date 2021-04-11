const { spawn } = require('child_process');
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
        // wsServer.getServer().close();
        valheimServer.stop().then(() => {
            // const dir = path.join(__dirname, '../../..');
            // spawn(path.join(dir, 'startserver.bat'), [], { cwd: dir, detached: true });
            wsServer.getServer().close();
            process.exit();
        });
    }
};