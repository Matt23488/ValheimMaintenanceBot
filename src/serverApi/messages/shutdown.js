const valheimServer = require('../valheimServer');
const wsServer = require('../wsServer');

module.exports = {
    prefix: 'shutdown',

    /**
     * 
     * @param {string} data 
     * @returns {Promise<null>}
     */
    execute: async function (data) {
        await valheimServer.stop();
        wsServer.destroyWhenReady();
        return null;
        // valheimServer.stop().then(() => {
        //     return null;
        //     wsServer.sendResponse(requestId, 'shutdown');
        //     wsServer.getServer().close();
        //     process.exit();
        // });
    }
};