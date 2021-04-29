import Discord from 'discord.js';

/**
 * Represents types that can be assigned to `T` but not to `U`.
 */
export type Diff<T, U> = T extends U ? never : T;

/**
 * If `T` is a function taking at least one parameter, this represents the type of the first parameter. Otherwise resolves to `never`.
 */
export type ParameterType<T> = T extends () => any ? never : T extends (p: infer U, ...rest: any[]) => any ? U : never;

/**
 * If `T` is a function taking at least one parameter, this represents the type of the first parameter. Otherwise resolves to `undefined`.
 */
export type ParameterTypeOrUndefined<T> = T extends () => any ? undefined : T extends (p: infer U, ...rest: any[]) => any ? U : undefined;

/**
 * If `T` is a `Promise<U>`, this resolves to `U`. Otherwise resolves to `never`.
 */
export type ResolvedType<T> = T extends Promise<infer U> ? U : never;

/**
 * A Filter that tells if the type of the given member (`U`) of `T` is a function with at least one parameter. Meant to be used only with `KeyOfTypeWithParameters<T>`.
 */
export type KeyOfTypeHasParameters<T, U extends keyof T> = T[U] extends () => any ? never : T[U] extends (p: any, ...rest: any[]) => any ? U : never;

/**
 * Filters out keys of `T` that don't resolve to a type which is a function taking at least one parameters.
 */
export type KeyOfTypeWithParameters<T> = ({ [U in keyof T]: KeyOfTypeHasParameters<T, U> })[keyof T];

/**
 * Represents the states that the Valheim Server can be in.
 */
export enum ServerStatuses {
    stopped,
    starting,
    ready
}

/**
 * Contains information about the status of the Valheim Server.
 */
export type ServerStatusInfo = {
    status: ServerStatuses,
    name: string,
    ip: string,
    password: string,
    connectedPlayers: { name: string, uptime: string }[],
    uptime: string,
    activeUptime: string
};

/**
 * Represents the kinds of messages that the server can send to the bot, along with the type of the data passed with the message.
 * Meant to be used as a type map to control the API using TypeScript type operations.
 */
export interface ClientMessageTypeMap {
    playerConnected: string;
    playerDied: string;
    playerDisconnected: string;
    underAttack: string;
    echo: string;
    stderr: string;
    stdout: string;
    started: string;
}

/**
 * Represents a module of the bot that can handle a server message. A more general version that is
 * used by the code that invokes the handler.
 */
export type ClientMessageDynamic = { execute: (data: ClientMessageTypeMap[keyof ClientMessageTypeMap]) => void };

/**
 * Represents a module of the bot that can handle a server message. A specific version that is
 * used by the modules themselves to get strong typing.
 */
export type ClientMessage<T extends keyof ClientMessageTypeMap> = { execute: (data: ClientMessageTypeMap[T]) => void };

/**
 * Takes any number of static string values and constructs type information and operations.
 * Proper use like so:
 * 
 *     const MyStringUnion = StringUnion('val1', 'val2', 'val3');
 *     type MyStringUnion = typeof MyStringUnion.type; // Resolves to 'val1' | 'val2' | 'val3'
 * 
 * @param values The string values that make up the string union type.
 * @returns An object containing operatinos information relevant to the string union type.
 */
export const StringUnion = <UnionType extends string>(...values: UnionType[]) => {
    Object.freeze(values);
    const valueSet: Set<string> = new Set(values);

    /**
     * Performs a type guard on the given value.
     * @param value The value to check
     * @returns `true` if `value` can be assigned to `UnionType`, `false` otherwise.
     */
    const guard = (value: string): value is UnionType => { return valueSet.has(value); };

    /**
     * Casts a given value to `UnionType`. If the value cannot be assigned to `UnionType`, a `TypeError` is thrown at runtime.
     * It is recommended to use `guard(value)` instead unless you know what you are doing. 
     * @param value The value to cast
     * @returns The same `value` that was passed in, but as a `UnionType` instead of `string`.
     */
    const check = (value: string): UnionType => {
        if (!guard(value)) {
            const actual = JSON.stringify(value);
            const expected = values.map(s => JSON.stringify(s)).join(' | ');
            throw new TypeError(`Value '${actual}' is not assignable to type '${expected}'.`);
        }
        return value;
    }

    const unionNamespace = { guard, check, values };
    return Object.freeze(unionNamespace as typeof unionNamespace & { type: UnionType });
};

/**
 * Represents the kinds of buffers that a process can have, namely `stdout` and `stderr`.
 */
export const ProcessBufferName = StringUnion('stdout', 'stderr');
export type ProcessBufferName = typeof ProcessBufferName.type;

/**
 * Represents the kinds of messages that the bot can send to the server, along with other type information associated with the message.
 * Meant to be used as a type map to control the API using TypeScript type operations.
 */
export interface ServerMessageTypeMap {
    save: (data: { name: ProcessBufferName, outFileName?: string, author: string }) => Promise<string>;
    shutdown: () => Promise<void>;
    status: () => Promise<ServerStatusInfo>;
}

/**
 * Represents the structure of the bot -> server message sent via ws.
 */
export type ServerMessageInput = {
    id?: number,
    type: keyof ServerMessageTypeMap,
    data: ParameterTypeOrUndefined<ServerMessageTypeMap[keyof ServerMessageTypeMap]>
};

/**
 * Represents the structure of the server -> bot response sent via ws.
 */
export type ServerMessageOutput = {
    id: number,
    type: keyof ServerMessageTypeMap,
    data: ResolvedType<ReturnType<ServerMessageTypeMap[keyof ServerMessageTypeMap]>>
};

/**
 * Represents the structure of the server -> bot response if there was an error trying to process the message.
 */
export type ServerMessageError = {
    id: number,
    type: keyof ServerMessageTypeMap,
    error: Error
};

/**
 * Represents the structure of unsolicited messages that the server sends to the bot via ws.
 */
export type ClientReceivedMessage = {
    type: keyof ClientMessageTypeMap,
    data: ClientMessageTypeMap[keyof ClientMessageTypeMap]
};

/**
 * Represents the different kinds of messages the bot can receive from the server via ws.
 */
export type UnknownMessage = ServerMessageOutput | ServerMessageError | ClientReceivedMessage;

/**
 * A type guard that checks if the provided response is a `ServerMessageError`.
 * @param response The message received from the ws server.
 * @returns `true` if the provided message is a `ServerMessageError`, `false` otherwise.
 */
export function isServerMessageError(response: UnknownMessage): response is ServerMessageError {
    return !!(response as ServerMessageError).error;
}

/**
 * A type guard that checks if the provided response is a `ClientReceivedMessage`.
 * @param response The message received from the ws server.
 * @returns `true` if the provided message is a `ClientReceivedMessage`, `false` otherwise.
 */
export function isClientReceivedMessage(response: UnknownMessage): response is ClientReceivedMessage {
    return typeof (response as ServerMessageOutput).id === 'undefined';
}

/**
 * Represents a module of the server that can handle a message from the bot. A more general version that is
 * used by the code that invokes the handler.
 */
export type ServerMessageDynamic = {
    prefix: keyof ServerMessageTypeMap,
    execute: (data: ParameterTypeOrUndefined<ServerMessageTypeMap[keyof ServerMessageTypeMap]>) => Promise<ResolvedType<ReturnType<ServerMessageTypeMap[keyof ServerMessageTypeMap]>>>
};

/**
 * Represents a module of the server that can handle a message from the bot. A specific version that is
 * used by the modules themselves to get strong typing.
 */
export type ServerMessage<T extends keyof ServerMessageTypeMap> = {
    prefix: T,
    execute: ServerMessageTypeMap[T]
};

/**
 * Represents the type information associated with the various triggers that the `stdout` from the Valheim server executable drives.
 * Meant to be used as a type map to control the API using TypeScript type operations.
 */
export interface ServerTriggerTypeMap {
    playerConnected: { id: string, name: string };
    playerDied: string;
    playerDisconnected: { id: string, name: string };
    underAttack: string;
}


/**
 * Represents a module of the server that can handle a trigger from the Valheim server executable. A more general version that is
 * used by the code that invokes the handler.
 */
export type ServerTriggerDynamic = {
    parse: (text: string) => { canHandle: false } | { canHandle: true, data: ServerTriggerTypeMap[keyof ServerTriggerTypeMap] },
    execute: (data: ServerTriggerTypeMap[keyof ServerTriggerTypeMap]) => void
};

/**
 * Represents a module of the server that can handle a trigger from the Valheim server executable. A specific version that is
 * used by the modules themselves to get strong typing.
 */
export type ServerTrigger<T extends keyof ServerTriggerTypeMap> = {
    parse: (text: string) => { canHandle: false } | { canHandle: true, data: ServerTriggerTypeMap[T] },
    execute: (data: ServerTriggerTypeMap[T]) => void
};

/**
 * Represents a module of the bot that can handle commands via Discord.
 */
export type BotCommand = {
    name: string,
    description: string,
    role: string | null,
    active: boolean,
    execute: (message: Discord.Message, rest: string) => Promise<void>
};