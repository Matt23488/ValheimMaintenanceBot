import WebSocket from 'ws';
import path from 'path';

type ServerMessage = { id?: number, type: string, data: any };
type ErrorResponse = ServerMessage & { error: string };
type MessageHandler = { execute: (data: any) => Promise<any> };

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

            let json: ServerMessage;
            try {
                json = JSON.parse(message);
            } catch (e) {
                console.error(`Unknown message from wsClient: ${message}`);
                return;
            }

            let handler: MessageHandler;
            try {
                handler = require(path.join(__dirname, 'messages', json.type));
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

// TODO: May not need this, everything maps to string. But I'm keeping it like this for now
// in case I need a message in the future that maps to something else. Actually, I should move this to utilities
// (and maybe into its own file at some point) so that the bot can also leverage the type map.
// I'll also want one for messages sent from bot -> server.
interface MessageTypeMap {
    playerConnected: string;
    playerDied: string;
    playerDisconnected: string;
    underAttack: string;
    echo: string;
    stderr: string;
    stdout: string;
    started: string;
}

export function sendMessage<T extends keyof MessageTypeMap>(type: T, data: MessageTypeMap[T]) {
    server.clients.forEach(ws => {
        ws.send(JSON.stringify({
            type,
            data
        }));
    });
}

export const destroyWhenReady = () => setTimeout(() => server.close(), 0);