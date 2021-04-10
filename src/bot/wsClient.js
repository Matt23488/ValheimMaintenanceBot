const WebSocket = require('ws');
const path = require('path');
const discordBot = require('./discord/bot');

/**
 * @type {WebSocket}
 */
let connection;

let connected = false;

/**
 * @returns {void}
 */
function connect() {

    // return new Promise(resolve => {
    //     function logic() {
            connection = new WebSocket('ws://localhost:8080');
        
            connection.onopen = e => {
                connected = true;
                // resolve();
            };
        
            connection.onclose = e => {
                connected = false;
                setTimeout(connect, 10000);
            }
        
            connection.onerror = error => {
                if (error.error && error.error.code === 'ECONNREFUSED') {
                    console.error('Couldn\'t connect to server. Trying again in 10 seconds.');
                    setTimeout(connect, 10000);
                }
            };
            
            connection.onmessage = message => {
                //const messageHandlers = fs.readdirSync(path.join(__dirname, 'messages')).map(f => require(path.join(__dirname, 'messages', f)));
        
                const space = message.data.indexOf(' ');
                const type = space > 0 ? message.data.slice(0, space) : message;
                const rest = space > 0 ? message.data.slice(space).trim() : '';
        
                try {
                    const handler = require(path.join(__dirname, 'messages', type));
                    handler.execute(rest);
                } catch (ess) {
                    console.log(`Unknown message from wsServer: ${message.data}`);
                }
        
                // for (let handler of messageHandlers) {
        
                //     // const parsed = trigger.parse(output);
                //     // if (!parsed.canHandle) continue;
        
                //     // trigger.execute(parsed.data);
                // }
            };
        // }

    //     logic();
    // });
}

module.exports = {
    isConnected: () => connected,
    getWsClient: () => connection,
    sendMessage: function (message) {
        if (!connected) return;

        connection.send(message);
    },
    connect
};