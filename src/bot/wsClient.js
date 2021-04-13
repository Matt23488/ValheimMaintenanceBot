const WebSocket = require('ws');
const path = require('path');
const discordBot = require('./discord/bot');

/**
 * @type {WebSocket}
 */
let connection;

let connected = false;
let tryReconnect = true;

/**
 * @type {Map<number, (data: any) => void>}
 */
const requestMap = new Map();
let requestId = 0;

/**
 * Sends a message to the server and waits for a response.
 * @param {string} type The type of message.
 * @param {any} data Any data that the server needs to process the message.
 * @returns {Promise<any>} A promise that resolves when the server processes the request and sends back the response.
 */
function sendRequest(type, data = null) {
    if (!connected) return Promise.resolve(null);

    /**
     * @type {Promise<any>}
     */
    return new Promise(resolve => {
        const currentId = requestId++;
        requestMap.set(currentId, resolve);
        connection.send(JSON.stringify({
            id: currentId,
            type,
            data
        }));
    });
}

/**
 * Sends a message to the server that does not need a response.
 * @param {string} type The type of message.
 * @param {any} data Any data that the server needs to process the message.
 */
function sendMessage(type, data) {
    if (!connected) return;

    connection.send(JSON.stringify({
        id: null,
        type,
        data
    }));
}

/**
 * Reads a message from the server. If the message contains an id, the `Promise` associated with the request will be resolved. Otherwise, the message is processed according to the associated module in the `messages` directory.
 * @param {string} message The message from the server.
 */
function receiveMessage(message) {
    /**
     * @type {{ id: number, type: string, data: any }}
     */
    const response = JSON.parse(message);
    if (response.id === null) {
        try {
            const handler = require(path.join(__dirname, 'messages', response.type));
            handler.execute(response.data);
        } catch (e) {
            console.log(`Unknown message from wsServer: ${message}`);
        }
        return;
    }

    const resolve = requestMap.get(response.id);
    requestMap.delete(response.id);
    resolve(response.data);
}

/**
 * Attempts to connect to the server. Will continually retry every 10 seconds if the connection fails.
 */
function connect() {

    connection = new WebSocket('ws://localhost:8080');

    connection.onopen = e => {
        connected = true;
    };

    connection.onclose = e => {
        connected = false;
        if (tryReconnect) setTimeout(connect, 10000);
    }

    connection.onerror = error => {
        if (error.error && error.error.code === 'ECONNREFUSED') {
            console.error('Couldn\'t connect to server. Trying again in 10 seconds.');
        }
    };
    
    connection.onmessage = message => {
        receiveMessage(message.data);
    };
}

/**
 * Closes the connection to the server and does not attempt to reconnect.
 */
function destroy() {
    tryReconnect = false;
    connection.close();
}

module.exports = {
    isConnected: () => connected,
    getWsClient: () => connection,
    sendMessage, // TODO: I don't think this is used anywhere.
    sendRequest,
    connect,
    destroy
};