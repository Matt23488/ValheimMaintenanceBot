const Discord = require('discord.js');
const fs = require('fs');
const _ = require('lodash');
const { spawn, exec } = require('child_process');
const roles = require('./discord/roles');

const config = require('./config');

// const ls = spawn('ls', ['-lh', '/']);
// const valheimServerStartPath = '"F:\\Apps\\Steam\\steamapps\\common\\Valheim dedicated server\\start_headless_server.bat"';
// const valheimServerWD = 'F:\\Apps\\Steam\\steamapps\\common\\Valheim dedicated server';
const test = fs.readFileSync(config.serverWorkingDirectory + config.serverBatchFile).toString();
const steamAppIdRefText = 'SteamAppId=';
const steamAppIdRef = test.indexOf(steamAppIdRefText);
const newLine = test.indexOf('\r\n', steamAppIdRef);
const steamAppId = test.slice(steamAppIdRef + steamAppIdRefText.length, newLine);
// console.log(process.env);

/**
 * @type {import('child_process').ChildProcessWithoutNullStreams}
 */
let valheimServerChildProc;// = spawn('ls', ['\lh', '/']);

const { getExternalIPv4 } = require('./ip');

/**
 * @type {string}
 */
let ipAddress;
getExternalIPv4().then(ip => {
    ipAddress = ip;
});

const commands = require('./discord/command');
commands.addCommand('kill', async (rest, discordMessage) => {
    async function exit() {
        await discordMessage.channel.send('bye');
        client.destroy();
    }

    if (valheimServerChildProc && valheimServerChildProc.exitCode === null) {
        await discordMessage.channel.send('Shutting down server...');
        valheimServerChildProc.kill('SIGINT');
        valheimServerChildProc.on('close', async (code, signal) => {
            console.log(`Valheim server child process exited with code ${code} (${signal})`);
            await exit();
        });
    } else await exit();
}, roles.Admin);

commands.addCommand('poop', async (rest, discordMessage) => {
    await discordMessage.reply('you\'re 12');
});

commands.addCommand('status', (rest, discordMessage) => {
    if (!valheimServerChildProc) {
        discordMessage.channel.send('The server is not currently started. Use `!start` to start the server.');
    } else if (valheimServerChildProc.exitCode !== null) {
        discordMessage.channel.send('The server it not currently started. Use `!start` to start the server.');
    } else {
        discordMessage.channel.send(`The server is currently running at \`${ipAddress}:2456\``);
    }
});

commands.addCommand('start', (rest, discordMessage) => {
    let processExists = !!valheimServerChildProc;
    let processHasExited = processExists ? valheimServerChildProc.exitCode !== null : false;
    if (processExists && !processHasExited) {
        discordMessage.channel.send('The server is already running.');
    } else {
        // exec()

        discordMessage.channel.send('Starting server...');
        valheimServerChildProc = spawn(config.serverExecutable, ['-nographics', '-batchmode', `-name "${config.name}"`, `-port ${config.port}`, `-world "${config.world}"`, `-password "${config.valheimServerPassword}"`, '-public 0'], { shell: true, cwd: config.serverWorkingDirectory, env: _.extend(process.env, { SteamAppId: steamAppId }) });
        valheimServerChildProc.stdout.on('data', data => {
            console.log(`VALHEIM: ${data.toString()}`);
            if (data instanceof Buffer && data.toString().indexOf('Game server connected') > 0) {
                discordMessage.channel.send(`Server started. IP: \`${ipAddress}:2456\``);
            }
        });
        valheimServerChildProc.stderr.on('data', data => {
            console.error(`Valheim Server error: ${data.toString()}`);
        });
    }
});

commands.addCommand('stop', async (rest, discordMessage) => {
    if (valheimServerChildProc && valheimServerChildProc.exitCode === null) {
        await discordMessage.channel.send('Shutting down server...');
        // valheimServerChildProc.kill();
        valheimServerChildProc.on('close', async (code, signal) => {
            console.log(`Valheim server child process exited with code ${code} (${signal})`);
            // await exit();
            discordMessage.channel.send('Server stopped.');
        });
        spawn('taskkill', [ '/IM', config.serverExecutable ]);
        // console.log(`kill(): ${valheimServerChildProc.kill('SIGQUIT')}`);
    } else await discordMessage.channel.send(`Server is not running.`);
}, roles.Admin);

const client = new Discord.Client();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    await commands.tryExecuteCommand(msg);
});

client.login(config.appToken);