const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const _ = require('lodash');
const config = require('./config');
const StringBuffer = require('./stringBuffer');


const batchFileText = fs.readFileSync(config.serverWorkingDirectory + config.serverBatchFile).toString();
const steamAppIdRefText = 'SteamAppId=';
const steamAppIdRef = batchFileText.indexOf(steamAppIdRefText);
const newLine = batchFileText.indexOf('\r\n', steamAppIdRef);
const steamAppId = batchFileText.slice(steamAppIdRef + steamAppIdRefText.length, newLine);

/**
 * @type {import('child_process').ChildProcessWithoutNullStreams}
 */
let serverProc;

/**
 * @type {Array<({ id: string, name: string }) => void>}
 */
const playerConnectedListeners = [];

/**
 * @type {Array<({ id: string, name: string }) => void>}
 */
const playerDisconnectedListeners = [];

module.exports = {
    /**
     * @type {{ id: string, name: string }[]}
     */
    connectedPlayers: [],

    isRunning: () => serverProc && serverProc.exitCode === null,

    /**
     * @type {StringBuffer}
     */
    stdoutBuffer: null,

    /**
     * @returns {Promise<void>}
     */
    start: function () {
        return new Promise(resolve => {
            if (this.isRunning()) resolve();

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

            this.connectedPlayers = [];
            let startEventSent = false;
            this.stdoutBuffer = new StringBuffer(25);
            serverProc.stdout.on('data', data => {
                // fs.appendFileSync(path.join(__dirname, config.valheim.stdout), `${data.toString()}`);
                this.stdoutBuffer.add(data.toString());


                if (data instanceof Buffer) {
                    const dataString = data.toString();
                    if (dataString.indexOf('Game server connected') > 0 && !startEventSent) {
                        startEventSent = true;
                        resolve();
                    } else if (dataString.indexOf('Got character ZDOID from ') > 0) {
                        const prefix = 'Got character ZDOID from ';
                        const prefixIndex = dataString.indexOf(prefix);
                        const firstColon = dataString.indexOf(':', prefixIndex + prefix.length);
                        const secondColon = dataString.indexOf(':', firstColon + 1);
                        const newPlayer = {
                            id: dataString.slice(firstColon + 1, secondColon).trim(),
                            name: dataString.slice(prefixIndex + prefix.length, firstColon).trim()
                        };

                        const existingPlayer = this.connectedPlayers.find(p => p.id === newPlayer.id);
                        if (!existingPlayer) {
                            this.connectedPlayers.push(newPlayer);
                            playerConnectedListeners.forEach(l => l(newPlayer));
                        }
                    } else if (dataString.indexOf('Destroying abandoned non persistent zdo ') > 0) {
                        const prefix = 'Destroying abandoned non persistent zdo ';
                        const prefixIndex = dataString.indexOf(prefix);
                        const colon = dataString.indexOf(':', prefixIndex + prefix.length);
                        const id = dataString.slice(prefixIndex + prefix.length, colon).trim();
                        const player = this.connectedPlayers.find(p => p.id === id);
                        if (player) {
                            this.connectedPlayers = this.connectedPlayers.filter(p => p.id !== id);
                            playerDisconnectedListeners.forEach(l => l(player));
                        }
                    }
                }

            });
        });
    },

    /**
     * @returns {Promise<void>}
     */
    stop: function () {
        return new Promise(resolve => {
            if (!this.isRunning()) {
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

    /**
     * 
     * @param {({ id: string, name: string }) => void} callback 
     */
    addPlayerConnectedListener: function (callback) {
        playerConnectedListeners.push(callback);
    },

    /**
     * 
     * @param {({ id: string, name: string }) => void} callback 
     */
    removePlayerConnectedListener: function (callback) {
        playerConnectedListeners = playerConnectedListeners.filter(l => l !== callback);
    },

    /**
     * 
     * @param {({ id: string, name: string }) => void} callback 
     */
    addPlayerDisconnectedListener: function (callback) {
        playerDisconnectedListeners.push(callback);
    },

    /**
     * 
     * @param {({ id: string, name: string }) => void} callback 
     */
    removePlayerDisconnectedListener: function (callback) {
        playerDisconnectedListeners = playerDisconnectedListeners.filter(l => l !== callback);
    }
};