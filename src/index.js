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

const client = new Discord.Client();

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const channel = client.channels.cache.get(config.defaultChannel);
    channel.send('I live. Starting server...');
    await valheimServer.start();
    channel.send(`Server started at \`${getServerIpAddress()}:${config.valheim.port}\`.`);
});

client.on('message', async msg => {
    if (msg.channel.id !== config.defaultChannel || msg.author.bot) return;

    const commandInfo = commandManager.parseMessage(msg.content);
    if (commandInfo) await commandManager.executeCommand(commandInfo, msg);
});

client.login(config.appToken);