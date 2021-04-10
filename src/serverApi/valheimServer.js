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

module.exports = {
    statuses: {
        stopped: 0,
        starting: 1,
        ready: 2
    },

    /**
     * @type {{ id: string, name: string }[]}
     */
    connectedPlayers: [],

    isRunning: () => serverProc && serverProc.exitCode === null,
    getStatus: function () {
        if (ready) return this.statuses.ready;
        if (started) return this.statuses.starting;
        return this.statuses.stopped;
    },

    /**
     * @type {StringBuffer}
     */
    stdoutBuffer: null,

    /**
     * @returns {void}
     */
    start: function () {
        if (this.isRunning()) return;

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
                ws.send(`stdout ${data.toString()}`);
            });

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
        if (!this.isRunning()) return;

        serverProc.on('close', (code, signal) => {
            console.log(`Valheim server child process exited with code ${code} (${signal})`);
            resolve();
        });
        spawn('taskkill', [ '/IM', config.serverExecutable ]);
    }
};