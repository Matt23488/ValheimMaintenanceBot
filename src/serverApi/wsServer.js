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
                /**
                 * @type {{ id: number, type: string, data: any }}
                 */
                let json;
                try {
                    json = JSON.parse(message);
                } catch (e) {
                    console.error(`Unknown message from wsClient: ${message}`);
                    return;
                }

                /**
                 * @type {{ execute: (data: any) => any }}
                 */
                let handler;
                try {
                    handler = require(path.join(__dirname, 'messages', json.type));
                } catch (e) {
                    console.error(`Unknown message from wsClient: ${message}`);
                    if (json.id !== null) {
                        json.error = e;
                        ws.send(JSON.stringify(json));
                        return;
                    }
                }

                try {
                    json.data = await handler.execute(json.data);
                    ws.send(JSON.stringify(json));
                } catch (e) {
                    console.error(`Error executing ${json.type}`);
                    console.error(e);
                    if (json.id !== null) {
                        json.error = e;
                        ws.send(JSON.stringify(json));
                    }
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