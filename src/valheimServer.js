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

            let startEventSent = false;
            serverProc.stdout.on('data', data => {
                fs.appendFileSync(path.join(__dirname, config.valheim.stdout), `${data.toString()}`);

                if (data instanceof Buffer && data.toString().indexOf('Game server connected') > 0 && !startEventSent) {
                    startEventSent = true;
                    resolve();
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
    }
};