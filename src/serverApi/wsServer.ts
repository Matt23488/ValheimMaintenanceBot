import WebSocket from 'ws';
import path from 'path';
import { ClientMessageTypeMap, ServerMessageDynamic, MessageTransferObject } from '../commonTypes';

type ErrorResponse = MessageTransferObject & { error: string };

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

            let json: MessageTransferObject;
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
                    const response: ErrorResponse = { ...json, error: e };
                    ws.send(JSON.stringify(response));
                    return;
                }
            }

            try {
                json.data = await handler!.execute(json.data);
                ws.send(JSON.stringify(json));
            } catch (e) {
                console.error(`Error executing ${json.type}`);
                console.error(e);
                if (json.id !== undefined) {
                    const response: ErrorResponse = { ...json, error: e };
                    ws.send(JSON.stringify(response));
                }
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