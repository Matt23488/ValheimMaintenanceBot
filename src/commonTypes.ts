import Discord from 'discord.js';

export type Diff<T, U> = T extends U ? never : T;
export type ParameterType<T> = T extends () => any ? never : T extends (p: infer U, ...rest: any[]) => any ? U : never;
export type ParameterTypeOrUndefined<T> = T extends () => any ? undefined : T extends (p: infer U, ...rest: any[]) => any ? U : undefined;
export type ResolvedType<T> = T extends Promise<infer U> ? U : never;
export type KeyOfTypeHasParameters<T, U extends keyof T> = T[U] extends () => any ? never : T[U] extends (p: any, ...rest: any[]) => any ? U : never;
export type KeyOfTypeWithParameters<T> = ({ [U in keyof T]: KeyOfTypeHasParameters<T, U> })[keyof T];

export enum ServerStatuses {
    stopped,
    starting,
    ready
}

export type ServerStatusInfo = {
    status: ServerStatuses,
    name: string,
    ip: string,
    password: string,
    connectedPlayers: { name: string, uptime: string }[],
    uptime: string,
    activeUptime: string
};

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

export type ClientMessageDynamic = { execute: (data: ClientMessageTypeMap[keyof ClientMessageTypeMap]) => void };
export type ClientMessage<T extends keyof ClientMessageTypeMap> = { execute: (data: ClientMessageTypeMap[T]) => void };

export const StringUnion = <UnionType extends string>(...values: UnionType[]) => {
    Object.freeze(values);
    const valueSet: Set<string> = new Set(values);

    const guard = (value: string): value is UnionType => { return valueSet.has(value); };
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

export const ProcessBufferName = StringUnion('stdout', 'stderr');
export type ProcessBufferName = typeof ProcessBufferName.type;

export interface ServerMessageDefinition {
    save: (data: { name: ProcessBufferName, outFileName?: string, author: string }) => Promise<string>;
    shutdown: () => Promise<void>;
    status: () => Promise<ServerStatusInfo>;
}

export type ServerMessageInput = { id?: number, type: keyof ServerMessageDefinition, data: ParameterTypeOrUndefined<ServerMessageDefinition[keyof ServerMessageDefinition]> };
export type ServerMessageOutput = { id: number, type: keyof ServerMessageDefinition, data: ResolvedType<ReturnType<ServerMessageDefinition[keyof ServerMessageDefinition]>> };
export type ServerMessageError = { id: number, type: keyof ServerMessageDefinition, error: Error };
export type ClientReceivedMessage = { type: keyof ClientMessageTypeMap, data: ClientMessageTypeMap[keyof ClientMessageTypeMap] };
export type UnknownMessage = ServerMessageOutput | ServerMessageError | ClientReceivedMessage;
export function isServerMessageError(response: UnknownMessage): response is ServerMessageError { return !!(response as ServerMessageError).error; }
export function isClientReceivedMessage(response: UnknownMessage): response is ClientReceivedMessage { return typeof (response as ServerMessageOutput).id === 'undefined'; }
export type ServerMessageDynamic = { prefix: keyof ServerMessageDefinition, execute: (data: ParameterTypeOrUndefined<ServerMessageDefinition[keyof ServerMessageDefinition]>) => Promise<ResolvedType<ReturnType<ServerMessageDefinition[keyof ServerMessageDefinition]>>> };
export type ServerMessage<T extends keyof ServerMessageDefinition> = {
    prefix: T,
    execute: ServerMessageDefinition[T]
};

export interface ServerTriggerTypeMap {
    playerConnected: { id: string, name: string };
    playerDied: string;
    playerDisconnected: { id: string, name: string };
    underAttack: string;
}

export type ServerTriggerDynamic = { parse: (text: string) => { canHandle: false } | { canHandle: true, data: ServerTriggerTypeMap[keyof ServerTriggerTypeMap] }, execute: (data: ServerTriggerTypeMap[keyof ServerTriggerTypeMap]) => void };
export type ServerTrigger<T extends keyof ServerTriggerTypeMap> = {
    parse: (text: string) => { canHandle: false } | { canHandle: true, data: ServerTriggerTypeMap[T] },
    execute: (data: ServerTriggerTypeMap[T]) => void
};

export type BotCommand = {
    name: string,
    description: string,
    role: string | null,
    active: boolean,
    execute: (message: Discord.Message, rest: string) => Promise<void>
};