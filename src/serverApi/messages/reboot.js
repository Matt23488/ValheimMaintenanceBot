const { spawn } = require('child_process');
const valheimServer = require('../valheimServer');
const wsServer = require('../wsServer');

module.exports = {
    prefix: 'reboot',

    /**
     * 
     * @param {string} data 
     * @returns {Promise<null>}
     */
    execute: async function (data) {
        // valheimServer.stop().then(() => {
        //     wsServer.getServer().close();
        //     const dir = path.join(__dirname, '../../..');
        //     spawn(path.join(dir, 'startserver.bat'), [], { cwd: dir, detached: true });
        //     process.exit();
        // });

        await valheimServer.stop();
        const dir = path.join(__dirname, '../../..');
        spawn(path.join(dir, 'startserver.bat'), [], { cwd: dir, detached: true });
        wsServer.destroyWhenReady();
        return null;
    }
};