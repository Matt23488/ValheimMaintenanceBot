const Discord = require('discord.js');
const fs = require('fs');

const { spawn } = require('child_process');
// const ls = spawn('ls', ['-lh', '/']);
const valheimServerStartPath = '"F:\\Apps\\Steam\\steamapps\\common\\Valheim dedicated server\\start_headless_server.bat"';
const valheimServerWD = 'F:\\Apps\\Steam\\steamapps\\common\\Valheim dedicated server';

/**
 * @type {import('child_process').ChildProcessWithoutNullStreams}
 */
let valheimServerChildProc;// = spawn('ls', ['\lh', '/']);

const { getExternalIPv4 } = require('./ip');
let ipAddress;
getExternalIPv4().then(ip => {
    ipAddress = ip;
});

const client = new Discord.Client();
const token = fs.readFileSync('token.txt').toString();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    const adminRole = msg.member.roles.cache.find(r => r.name === 'Admin');

    if (adminRole) {
        if (msg.content === '!kill') {
            await msg.channel.send('bye');
            client.destroy();
            return;
        }
        
        
        // else if (msg.content === '!stop') {
        // //     msg.channel.send('Stopping server...');
        // //     valheimServerChildProc.kill()
        // // } else if (msg.content = '!restart') {

        // }
    }
    
    
    if (msg.content === '!poop') {
        msg.reply('you\'re 12');
    }
    
    
    else if (msg.content === '!status') {
        if (!valheimServerChildProc) {
            msg.channel.send('The server is not currently started. Use !start to start the server.');
        } else if (valheimServerChildProc.exitCode !== null) {
            msg.channel.send('The server it not currently started. Use !start to start the server.');
        } else {
            msg.channel.send(`The server is currently running at \`${ipAddress}:2456\``);
        }
    }
    
    
    else if (msg.content === '!start') {
        let processExists = !!valheimServerChildProc;
        let processHasExited = processExists ? valheimServerChildProc.exitCode !== null : false;
        if (processExists && !processHasExited) {
            msg.channel.send('The server is already running.');
        } else {
            msg.channel.send('Starting server...');
            valheimServerChildProc = spawn(valheimServerStartPath, [], { shell: true, cwd: valheimServerWD });
            valheimServerChildProc.stdout.on('data', data => {
                // console.log(data);
                if (data instanceof Buffer && data.toString().indexOf('Game server connected') > 0) {
                    msg.channel.send(`Server started. IP: \`${ipAddress}:2456\``);
                }
            });
            valheimServerChildProc.stderr.on('data', data => {
                console.error(`Valheim Server error: ${data}`);
            });
        }
    }

    // else if (msg.content === '!ip') {
    //     msg.channel.send(`\`${ipAddress}:2456\``);
    // }
});

client.login(token);