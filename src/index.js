const Discord = require('discord.js');
const { spawn } = require('child_process');
const roles = require('./discord/roles');

const config = require('./config');

const valheimServer = require('./valheimServer');

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

    if (valheimServer.isRunning()) {
        discordMessage.channel.send('Stopping server...');
        valheimServer.stop(async () => {
            await discordMessage.channel.send('Server stopped.');
            await exit();
        });
    } else await exit();
}, roles.Admin);

commands.addCommand('poop', async (rest, discordMessage) => {
    await discordMessage.reply('you\'re 12');
});

commands.addCommand('status', (rest, discordMessage) => {
    if (!valheimServer.isRunning()) discordMessage.channel.send('The server is not currently started. Use `!start` to start the server.');
    else discordMessage.channel.send(`The server is currently running at \`${ipAddress}:2456\`.`);
});

commands.addCommand('start', (rest, discordMessage) => {
    if (valheimServer.isRunning()) {
        discordMessage.channel.send(`The server is already running at \`${ipAddress}:2456\`.`);
    } else {
        discordMessage.channel.send('Starting server...');
        valheimServer.start(() => {
            discordMessage.channel.send(`Server started at \`${ipAddress}:2456\`.`);
        });
    }
});

commands.addCommand('stop', async (rest, discordMessage) => {
    if (!valheimServer.isRunning()) {
        discordMessage.channel.send('The server is not running. Use `!start` to start the server.');
    } else {
        discordMessage.channel.send('Stopping server...');
        valheimServer.stop(() => {
            discordMessage.channel.send('Server stopped.');
        });
    }
}, roles.Admin);

commands.addCommand('reboot', async (rest, discordMessage) => {
    const stopServer = valheimServer.isRunning();
    if (stopServer) discordMessage.channel.send('Stopping server...');
    await valheimServer.stopAsync();
    if (stopServer) await discordMessage.channel.send('Server stopped.');

    await discordMessage.channel.send('Rebooting VM. See you folks on the other side.');
    spawn('shutdown', [ '/r' ], { detached: true });
    client.destroy();

}, roles.Admin);

const client = new Discord.Client();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const channel = client.channels.cache.get(config.defaultChannel);
    channel.send('I live. Starting server...');
    valheimServer.start(() => {
        channel.send(`Server started at \`${ipAddress}:2456\`.`);
    });
});

client.on('message', async msg => {
    await commands.tryExecuteCommand(msg);
});

client.login(config.appToken);