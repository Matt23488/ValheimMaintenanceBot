import WebSocket from 'ws';
import path from 'path';
import { ClientMessageTypeMap, ServerMessageDynamic, ServerMessageError, ServerMessageInput, ServerMessageOutput } from '../commonTypes';

let server: WebSocket.Server;

export const getServer = () => server;

export function startServer() {
    if (server) return;

    server = new WebSocket.Server({ port: 8080 });

    server.on('connection', ws => {
        ws.on('message', async message => {
            if (typeof message !== 'string') {
                console.error(`Unknown message from wsClient: ${message}`);
                return;
            }

            let json: ServerMessageInput;
            try {
                json = JSON.parse(message);
            } catch (e) {
                console.error(`Unknown message from wsClient: ${message}`);
                return;
            }

            let handler: ServerMessageDynamic;
            try {
                handler = require(path.join(__dirname, 'messages', json.type)).message;
            } catch (e) {
                console.error(`Unknown message from wsClient: ${message}`);
                if (json.id !== undefined) {
                    const response: ServerMessageError = {
                        id: json.id,
                        type: json.type,
                        error: e
                    };
                    ws.send(JSON.stringify(response));
                }
                return;
            }

            let result;
            try {
                result = await handler.execute(json.data);
            } catch (e) {
                console.error(`Error executing ${json.type}`);
                console.error(e);
                if (json.id !== undefined) {
                    const response: ServerMessageError = {
                        id: json.id,
                        type: json.type,
                        error: e
                    };
                    ws.send(JSON.stringify(response));
                }
                return;
            }

            if (json.id !== undefined) {
                const output: ServerMessageOutput = {
                    id: json.id,
                    type: json.type,
                    data: result
                };
                ws.send(JSON.stringify(output));
            }
        });
    });
}

export function sendMessage<T extends keyof ClientMessageTypeMap>(type: T, data: ClientMessageTypeMap[T]) {
    server.clients.forEach(ws => {
        ws.send(JSON.stringify({
            type,
            data
        }));
    });
}

export const destroyWhenReady = () => setTimeout(() => server.close(), 0);