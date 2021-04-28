import WebSocket from 'ws';
import path from 'path';
import { ServerMessageTypeMap, ServerMessageResponseTypeMap, ClientMessageDynamic, StringUnion, ServerMessageDataTypeMap } from '../commonTypes';

let connection: WebSocket;
let connected = false;
let tryReconnect = true;

const ignoreMessageSet = new Set<string>();

const requestMap = new Map<number, (data: any) => void>();
let requestId = 0;

// type ParameterType<T> = T extends () => any ? undefined : T extends (p: infer U, ...rest: any[]) => any ? U : undefined;
// type ResolvedType<T> = T extends Promise<infer U> ? U : never;
// const Parameterless = StringUnion('status', 'shutdown');
// type Parameterless = typeof Parameterless.type;
// const Parameterful = StringUnion('save');
// type Parameterful = typeof Parameterful.type;
type Diff<T, U> = T extends U ? never : T;
/**
 * Sends a message to the server and waits for a response.
 * @param type The type of message.
 * @param data Any data that the server needs to process the message.
 * @returns A promise that resolves when the server processes the request and sends back the response.
 */
export function sendRequest<T extends keyof ServerMessageDataTypeMap>(type: T, data: ServerMessageDataTypeMap[T]): Promise<ServerMessageResponseTypeMap[T]>;
export function sendRequest<T extends Diff<keyof ServerMessageTypeMap, keyof ServerMessageDataTypeMap>>(type: T): Promise<ServerMessageResponseTypeMap[T]>;
export function sendRequest<T extends ServerMessageTypeMap>(type: T, data?: T extends keyof ServerMessageDataTypeMap ? ServerMessageDataTypeMap[T] : never) {
    if (!connected) return Promise.resolve(null);

    return new Promise<T extends keyof ServerMessageResponseTypeMap ? ServerMessageResponseTypeMap[T] : never>(resolve => {
        const currentId = requestId++;
        requestMap.set(currentId, resolve);
        connection.send(JSON.stringify({
            id: currentId,
            type,
            data
        }));
    });
}

// export function sendRequest<T extends Parameterless>(type: T): ReturnType<ServerMessageTypeMap[T]>;
// export function sendRequest<T extends Parameterful>(type: T, data: ParameterType<ServerMessageTypeMap[T]>): ReturnType<ServerMessageTypeMap[T]>;
// export function sendRequest<T extends keyof ServerMessageTypeMap>(type: T, data?: ParameterType<ServerMessageTypeMap[T]>) {
//     if (!connected) return Promise.resolve(null);

//     return new Promise<ResolvedType<ReturnType<ServerMessageTypeMap[T]>>>(resolve => {
//         const currentId = requestId++;
//         requestMap.set(currentId, resolve);
//         connection.send(JSON.stringify({
//             id: currentId,
//             type,
//             data
//         }));
//     });
// }

/**
 * // TODO: I don't think this is used anywhere.
 * Sends a message to the server that does not need a response.
 * @param type The type of message.
 * @param data Any data that the server needs to process the message.
 */
export function sendMessage(type: string, data: any) {
    if (!connected) return;

    connection.send(JSON.stringify({
        type,
        data
    }));
}

// Can't use a typemap here, as the messages coming in are dynamic and thus their types are unknowable at compile-time.
type Response = { id?: number, type: string, data: any, error?: string };
/**
 * Reads a message from the server. If the message contains an id, the `Promise` associated with the request will be resolved. Otherwise, the message is processed according to the associated module in the `messages` directory.
 * @param message The message from the server.
 */
function receiveMessage(message: string) {
    const response = JSON.parse(message) as Response;
    if (response.error) throw new Error(`Error sending '${message}' to server:\n${response.error}`);

    if (response.id === undefined) {
        console.log(`Received message '${response.type}' from server`);
        if (ignoreMessageSet.has(response.type)) {
            console.log('Ignoring');
            ignoreMessageSet.delete(response.type);
            return;
        }

        if (onMessageCallbacks.has(response.type)) onMessageCallbacks.get(response.type)!.forEach(c => c());

        try {
            const handler = require(path.join(__dirname, 'messages', response.type)).message as ClientMessageDynamic;
            handler.execute(response.data);
        } catch (e) {
            console.log(`Unknown message from wsServer: ${message}`);
        }
        return;
    }

    const resolve = requestMap.get(response.id)!;
    requestMap.delete(response.id);
    resolve(response.data);
}

/**
 * Causes the wsClient to ignore the next message of the given type.
 * @param type
 */
export function ignoreMessage(type: string) {
    ignoreMessageSet.add(type);
}

let onConnectedCallbacks: Array<() => void> = [];
/**
 * Registers a callback to be called when the wsClient connects.
 * @param callback
 */
export function onConnected(callback: () => void) {
    onConnectedCallbacks.push(callback);
}

/**
 * Unregisters a callback to be called when the wsClient connects.
 * @param callback
 */
export function offConnected(callback: () => void) {
    onConnectedCallbacks = onConnectedCallbacks.filter(c => c !== callback);
}

const onMessageCallbacks = new Map<string, Array<() => void>>();
/**
 * Registers a callback to be called when a message of the specified type is received from the server.
 * @param type 
 * @param callback 
 */
export function onMessage(type: string, callback: () => void) {
    let callbacks: Array<() => void>;
    if (onMessageCallbacks.has(type)) callbacks = onMessageCallbacks.get(type)!;
    else {
        callbacks = [];
        onMessageCallbacks.set(type, callbacks);
    }

    callbacks.push(callback);
    // Leaving this code in case for some reason the arrays aren't passed by reference.
    // const callbacks = onMessageCallbacks.has(type) ? onMessageCallbacks.get(type) : [];
    // callbacks.push(callback);
    // onMessageCallbacks.set(type, callbacks);
}

/**
 * Attempts to connect to the server. Will continually retry every 10 seconds if the connection fails.
 */
export function connect() {

    connection = new WebSocket('ws://localhost:8080');

    connection.onopen = e => {
        connected = true;
        onConnectedCallbacks.forEach(c => c());
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
        receiveMessage(message.data.toString());
    };
}

/**
 * Closes the connection to the server and does not attempt to reconnect.
 */
export function destroy() {
    tryReconnect = false;
    connection.close();
}

export const isConnected = () => connected;
export const getWsClient = () => connection;