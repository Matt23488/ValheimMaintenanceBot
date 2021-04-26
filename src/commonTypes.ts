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

export interface ServerMessageTypeMap {
    save: { name: string, outFileName?: string, author: string };
    shutdown: undefined;
    status: undefined;
}

export interface ServerMessageResponseTypeMap {
    save: string;
    status: ServerStatusInfo;
}