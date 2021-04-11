const { spawn } = require('child_process');
const valheimServer = require('../valheimServer');
const wsServer = require('../wsServer');

module.exports = {
    prefix: 'reboot',

    /**
     * 
     * @param {number} requestId
     * @param {string} data 
     * @returns {string}
     */
    execute: function (requestId, data) {
        valheimServer.stop().then(() => {
            wsServer.getServer().close();
            const dir = path.join(__dirname, '../../..');
            spawn(path.join(dir, 'startserver.bat'), [], { cwd: dir, detached: true });
            process.exit();
        });
    }
};