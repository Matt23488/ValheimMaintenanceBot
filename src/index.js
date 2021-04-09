const Discord = require('discord.js');
const config = require('./config');
const valheimServer = require('./valheimServer');
const commandManager = require('./discord/commandManager');
const { getServerIpAddress } = require('./ip');

// TODO:
// !uptime
// !backup world
// !change world
// !help
// Formatting for posts
// Separate log files for server instances, delete after so many, etc
// Send errors to channel with the formatting thingy
// Keep track of connected players using the server logs
// Random event set:foresttrolls (detect these) (army_bonemass is another)
// Fix issue with players dying and being re-added to the server.
// !reboot should take a param ('bot', 'server', 'vm')
// Accept commands on a dm channel if possible to avoid spamming the server

const client = new Discord.Client();

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const channel = client.channels.cache.get(config.defaultChannel);
    channel.send('I live. Starting server...');
    await valheimServer.start();
    channel.send(`Server started at \`${getServerIpAddress()}:${config.valheim.port}\`.`);

    function getPlayerCountMessage() {
        return `There ${valheimServer.connectedPlayers.length === 1 ? 'is' : 'are'} currently ${valheimServer.connectedPlayers.length} player${valheimServer.connectedPlayers.length === 1 ? '' : 's'} on the server.`;
    }

    valheimServer.addPlayerConnectedListener(player => {
        channel.send(`Player \`${player.name}\` has joined the server! ${getPlayerCountMessage()}`);
    });

    valheimServer.addPlayerDisconnectedListener(player => {
        channel.send(`Player \`${player.name}\` has left the server. ${getPlayerCountMessage()}`);
    });
});

client.on('message', async msg => {
    if (msg.channel.id !== config.defaultChannel || msg.author.bot) return;

    const commandInfo = commandManager.parseMessage(msg.content);
    if (commandInfo) await commandManager.executeCommand(commandInfo, msg);
});

client.login(config.appToken);