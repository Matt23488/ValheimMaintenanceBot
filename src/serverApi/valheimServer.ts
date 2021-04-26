import fs from 'fs';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import _ from 'lodash';
import Stopwatch from '../stopwatch';
import { getAppSettings } from '../config';
import StringBuffer from '../stringBuffer';
import * as triggerLoader from './triggerLoader';
import * as wsServer from './wsServer';
import { getServerIpAddress } from '../ip';
import { ServerStatuses } from '../utilities';

let config = getAppSettings();

const batchFileText = fs.readFileSync(config.valheim.serverWorkingDirectory + config.valheim.serverBatchFile).toString();
const steamAppIdRefText = 'SteamAppId=';
const steamAppIdRef = batchFileText.indexOf(steamAppIdRefText);
const newLine = batchFileText.indexOf('\r\n', steamAppIdRef);
const steamAppId = batchFileText.slice(steamAppIdRef + steamAppIdRefText.length, newLine);

let serverProc: ChildProcessWithoutNullStreams;
let started = false;
let ready = false;

let stopwatch: Stopwatch;
let activeStopwatch: Stopwatch;

function readStopwatch(sw: Stopwatch): number {
    if (!sw) return 0;

    const ms = sw.read();
    return isNaN(ms) ? 0 : ms;
}

let stdoutBuffer: StringBuffer;
let stderrBuffer: StringBuffer;

type ConnectedPlayer = { id: string, name: string, stopwatch: Stopwatch };
let connectedPlayers: ConnectedPlayer[];

export enum Statuses {
    stopped,
    starting,
    ready
}

export function getStatus() {
    if (ready) return ServerStatuses.ready;
    if (started) return ServerStatuses.starting;
    return ServerStatuses.stopped;
}

export function start() {
    if (getStatus() !== ServerStatuses.stopped) return;
    config = getAppSettings();

    serverProc = spawn(
        config.valheim.serverExecutable,
        [
            '-nographics',
            '-batchmode',
            `-name "${config.valheim.name}"`,
            `-port ${config.valheim.port}`,
            `-world "${config.valheim.world}"`,
            `-password "${config.valheim.password}"`,
            `-public ${config.valheim.public}`
        ], {
            shell: true,
            cwd: config.valheim.serverWorkingDirectory,
            env: _.extend(process.env, { SteamAppId: steamAppId })
        }
    );
    started = true;
    connectedPlayers = [];
    stdoutBuffer = new StringBuffer(25);
    stderrBuffer = new StringBuffer(25);

    serverProc.stderr.on('data', data => {
        const dataString = data.toString();
        stderrBuffer.add(dataString);
        wsServer.sendMessage('stderr', dataString);
    });

    let startEventSent = false;
    serverProc.stdout.on('data', data => {
        const dataString = data.toString();

        wsServer.sendMessage('stdout', dataString);

        console.log(dataString);
        stdoutBuffer.add(dataString);

        if (dataString.indexOf('Game server connected') > 0 && !startEventSent) {
            stopwatch = new Stopwatch(true);
            activeStopwatch = new Stopwatch();
            startEventSent = true;
            ready = true;
            wsServer.sendMessage('started', `${getServerIpAddress()}:${config.valheim.port}`);
        } else triggerLoader.handleOutput(dataString);
    });
}

export function stop() {
    config = getAppSettings();
    return new Promise<void>(resolve => {
        if (getStatus() === ServerStatuses.stopped) {
            resolve();
            return;
        }

        serverProc.on('close', (code, signal) => {
            console.log(`Valheim server child process exited with code ${code} (${signal})`);
            resolve();
        });
        spawn('taskkill', [ '/IM', config.valheim.serverExecutable ]);
    });
}

export const getServerUptime = () => readStopwatch(stopwatch);
export const getServerActiveUptime = () => readStopwatch(activeStopwatch);

export type BufferName = 'stdout' | 'stderr';
export function getBuffer(name: BufferName) {
    switch (name) {
        case 'stdout': return stdoutBuffer;
        case 'stderr': return stderrBuffer;
    }
}

export function addPlayer(id: string, name: string) {
    if (connectedPlayers.length === 0) activeStopwatch = new Stopwatch(true, readStopwatch(activeStopwatch));
    connectedPlayers.push({ id, name, stopwatch: new Stopwatch(true) });
};

export function findPlayer(id: string) {
    return connectedPlayers.find(p => p.id === id);
}

export function removePlayer(id: string) {
    connectedPlayers.find(p => p.id === id)?.stopwatch.stop();
    connectedPlayers = connectedPlayers.filter(p => p.id !== id);
    if (connectedPlayers.length === 0) activeStopwatch.stop();
}

export const getPlayers = () => connectedPlayers;