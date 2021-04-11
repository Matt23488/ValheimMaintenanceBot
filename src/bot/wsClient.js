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
 * 
 * @param {string} type 
 * @param {any} data 
 * @returns {Promise<any>}
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
 * 
 * @param {string} type 
 * @param {any} data 
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
 * 
 * @param {string} message 
 * @returns {boolean}
 */
function receiveResponse(message) {
    /**
     * @type {{ id: number, type: string, data: any }}
     */
    const response = JSON.parse(message);
    if (response.id === null) {
        try {
            const handler = require(path.join(__dirname, 'messages', response.type));
            handler.execute(response.data);
        } catch (ess) {
            console.log(`Unknown message from wsServer: ${message.data}`);
        }
        return;
    }

    const resolve = requestMap.get(response.id);
    requestMap.delete(response.id);
    resolve(response.data);
}

/**
 * @returns {void}
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
            setTimeout(connect, 10000);
        }
    };
    
    connection.onmessage = message => {
        receiveResponse(message.data);
    };
}

function destroy() {
    tryReconnect = false;
    connection.close();
}

module.exports = {
    isConnected: () => connected,
    getWsClient: () => connection,
    sendMessage,
    sendRequest,
    connect,
    destroy
};