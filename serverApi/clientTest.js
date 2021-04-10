const WebSocket = require('ws');

const connection = new WebSocket('ws://localhost:8080');

connection.onopen = () => {
    connection.send('Message From Client');
};

connection.onerror = error => {
    console.error(`WebSocket error: ${error}`);
};

connection.onmessage = e => {
    console.log(e.data);
};