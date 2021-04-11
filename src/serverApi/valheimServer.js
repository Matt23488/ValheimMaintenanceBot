const fs = require('fs');
const { spawn } = require('child_process');
const _ = require('lodash');
const config = require('../config');
const StringBuffer = require('../stringBuffer');
const triggerLoader = require('./triggerLoader');
const { getServer } = require('./wsServer');
const { getServerIpAddress } = require('../ip');


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
     * @type {{ id: string, name: string }[]}
     */
    connectedPlayers: [],

    // isRunning: () => serverProc && serverProc.exitCode === null,
    getStatus,

    /**
     * @type {StringBuffer}
     */
    stdoutBuffer: null,

    /**
     * @returns {void}
     */
    start: function () {
        //if (this.isRunning()) return;
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
        this.connectedPlayers = [];

        serverProc.stderr.on('data', data => {
            getServer().clients.forEach(ws => {
                ws.send(`stderr ${data.toString()}`);
            });
        });

        let startEventSent = false;
        serverProc.stdout.on('data', data => {
            const dataString = data.toString();

            getServer().clients.forEach(ws => {
                ws.send(`stdout ${dataString}`);
            });

            console.log(dataString);

            if (dataString.indexOf('Game server connected') > 0 && !startEventSent) {
                startEventSent = true;
                ready = true;
                getServer().clients.forEach(ws => {
                    ws.send(`echo Server started at \`${getServerIpAddress()}:${config.valheim.port}\`.`);
                });
            } else triggerLoader.handleOutput(dataString);
        });
    },

    /**
     * @returns {Promise<void>}
     */
    stop: function () {
        if (getStatus() === statuses.stopped) return;

        serverProc.on('close', (code, signal) => {
            console.log(`Valheim server child process exited with code ${code} (${signal})`);
        });
        spawn('taskkill', [ '/IM', config.serverExecutable ]);
    }
};