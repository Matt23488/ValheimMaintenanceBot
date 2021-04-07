const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const _ = require('lodash');
const config = require('./config');


const batchFileText = fs.readFileSync(config.serverWorkingDirectory + config.serverBatchFile).toString();
const steamAppIdRefText = 'SteamAppId=';
const steamAppIdRef = batchFileText.indexOf(steamAppIdRefText);
const newLine = batchFileText.indexOf('\r\n', steamAppIdRef);
const steamAppId = batchFileText.slice(steamAppIdRef + steamAppIdRefText.length, newLine);

/**
 * @type {import('child_process').ChildProcessWithoutNullStreams}
 */
let serverProc;

module.exports = {
    isRunning: () => serverProc && serverProc.exitCode === null,

    /**
     * 
     * @param {() => void} callback
     */
    start: function (callback) {
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

        let startEventSent = false;
        serverProc.stdout.on('data', data => {
            fs.appendFileSync(path.join(__dirname, config.valheim.stdout), `${data.toString()}`);

            if (data instanceof Buffer && data.toString().indexOf('Game server connected') > 0 && !startEventSent) {
                startEventSent = true;
                callback();
            }

        });
    },

    /**
     * 
     * @param {() => void} callback 
     */
    stop: function (callback) {
        if (!this.isRunning()) return;

        serverProc.on('close', async (code, signal) => {
            console.log(`Valheim server child process exited with code ${code} (${signal})`);
            callback();
        });
        spawn('taskkill', [ '/IM', config.serverExecutable ]);
        // callback();
    },

    /**
     * @returns {Promise<void>}
     */
    stopAsync: function () {
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
    }
};