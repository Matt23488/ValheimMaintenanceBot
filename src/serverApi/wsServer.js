const WebSocket = require('ws');
const path = require('path');

/**
 * @type {WebSocket.Server}
 */
let server;

// module.exports = server;
module.exports = {
    getServer: () => server,
    startServer: () => {
        if (server) return;

        server = new WebSocket.Server({ port: 8080 });

        server.on('connection', ws => {
            ws.on('message', message => {
                const space = message.indexOf(' ');
                const type = space > 0 ? message.slice(0, space) : message;
                const rest = space > 0 ? message.slice(space).trim() : '';
        
                try {
                    const handler = require(path.join(__dirname, 'messages', type));
                    handler.execute(rest);
                } catch (e) {
                    console.log(`Unknown message from wsServer: ${message}`);
                }
            });

            ws.send('Hello! Message From Server!!');
        });
    }
};