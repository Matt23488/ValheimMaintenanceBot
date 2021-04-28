import Discord from 'discord.js';

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

export type ClientMessageDynamic = { execute: (data: any) => void };
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

export interface ServerMessageTypeMap {
    save: (data: { name: ProcessBufferName, outFileName?: string, author: string }) => Promise<string>;
    shutdown: () => Promise<void>;
    status: () => Promise<ServerStatusInfo>;
}

export interface ServerMessageDataTypeMap {
    save: { name: ProcessBufferName, outFileName?: string, author: string };
}

export interface ServerMessageResponseTypeMap {
    save: string;
    shutdown: void;
    status: ServerStatusInfo;
}

export type MessageTransferObject = { id?: number, type: string, data: any };
export type ServerMessageDynamic = { prefix: keyof ServerMessageTypeMap, execute: (data: any) => Promise<any> };
export type ServerMessage<T extends keyof ServerMessageTypeMap> = {
    prefix: T,
    execute: ServerMessageTypeMap[T]
};

export interface ServerTriggerTypeMap {
    playerConnected: { id: string, name: string };
    playerDied: string;
    playerDisconnected: { id: string, name: string };
    underAttack: string;
}

export type ServerTriggerDynamic = { parse: (text: string) => { canHandle: false } | { canHandle: true, data: any }, execute: (data: any) => void };
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