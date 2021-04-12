const WebSocket = require('ws');
const path = require('path');

/**
 * @type {WebSocket.Server}
 */
let server;

module.exports = {
    getServer: () => server,
    startServer: () => {
        if (server) return;

        server = new WebSocket.Server({ port: 8080 });

        server.on('connection', ws => {
            ws.on('message', async message => {
                try {
                    /**
                     * @type {{ id: number, type: string, data: any }}
                     */
                    const json = JSON.parse(message);
                    const handler = require(path.join(__dirname, 'messages', json.type));
                    json.data = await handler.execute(json.data);
                    ws.send(JSON.stringify(json));
                } catch (e) {
                    console.log(`Unknown message from wsClient: ${message}`);
                }
            });
        });
    },
    /**
     * 
     * @param {string} type 
     * @param {any} data
     */
    sendMessage: (type, data) => {
        server.clients.forEach(ws => {
            ws.send(JSON.stringify({
                id: null,
                type,
                data
            }));
        });
    },

    destroyWhenReady: function () {
        setTimeout(() => server.close(), 0);
    }
};