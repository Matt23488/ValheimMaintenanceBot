const fs = require('fs');
const { spawn } = require('child_process');
const _ = require('lodash');
const Stopwatch = require('statman-stopwatch');
const config = require('../config');
const StringBuffer = require('../stringBuffer');
const triggerLoader = require('./triggerLoader');
const { getServerIpAddress } = require('../ip');
const wsServer = require('./wsServer');


const batchFileText = fs.readFileSync(config.serverWorkingDirectory + config.serverBatchFile).toString();
const steamAppIdRefText = 'SteamAppId=';
const steamAppIdRef = batchFileText.indexOf(steamAppIdRefText);
const newLine = batchFileText.indexOf('\r\n', steamAppIdRef);
const steamAppId = batchFileText.slice(steamAppIdRef + steamAppIdRefText.length, newLine);

/**
 * @type {import('child_process').ChildProcessWithoutNullStreams}
 */
let serverProc;
let started = false;
let ready = false;

/**
 * @type {Stopwatch}
 */
let stopwatch;

/**
 * @type {StringBuffer}
 */
let stdoutBuffer;
let stderrBuffer = stdoutBuffer;

const statuses = {
    stopped: 0,
    starting: 1,
    ready: 2
};

function getStatus() {
    if (ready) return statuses.ready;
    if (started) return statuses.starting;
    return statuses.stopped;
}

module.exports = {
    statuses,

    /**
     * @type {{ id: string, name: string, stopwatch: Stopwatch }[]}
     */
    connectedPlayers: [],

    getStatus,

    /**
     * @returns {void}
     */
    start: function () {
        if (getStatus() !== statuses.stopped) return;

        serverProc = spawn(
            config.serverExecutable,
            [
                '-nographics',
                '-batchmode',
                `-name "${config.valheim.name}"`,
                `-port ${config.valheim.port}`,
                `-world "${config.valheim.world}"`,
                `-password "${config.valheim.password}"`,
                '-public 0'
            ], {
                shell: true,
                cwd: config.serverWorkingDirectory,
                env: _.extend(process.env, { SteamAppId: steamAppId })
            }
        );
        started = true;
        this.connectedPlayers = []; // TODO: Refactor this to a module variable instead of an instance variable. Will need to expose add and remove methods for the triggers that access this.
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
                startEventSent = true;
                ready = true;
                // TODO: Uncomment this. I only removed it to prevent spam.
                //wsServer.sendMessage('echo', `Server started at \`${getServerIpAddress()}:${config.valheim.port}\`.`);
            } else triggerLoader.handleOutput(dataString);
        });
    },

    /**
     * @returns {Promise<void>}
     */
    stop: function () {
        return new Promise(resolve => {
            if (getStatus() === statuses.stopped) {
                resolve();
                return;
            }
    
            serverProc.on('close', (code, signal) => {
                console.log(`Valheim server child process exited with code ${code} (${signal})`);
                resolve();
            });
            spawn('taskkill', [ '/IM', config.serverExecutable ]);
        });
    },

    getServerUptime: function () {
        if (!stopwatch || stopwatch.state() !== stopwatch.STATES.RUNNING) return -1;

        return stopwatch.read();
    },


    /**
     * 
     * @param {string} name 
     * @returns {StringBuffer}
     */
    getBuffer: function (name) {
        switch (name) {
            case 'stdout': return stdoutBuffer
            case 'stderr': return stderrBuffer;
            default: return null;
        }
    },
};