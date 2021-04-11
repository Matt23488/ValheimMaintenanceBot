const Discord = require('discord.js');
const roles = require('../roles');
const { spawn } = require('child_process');
const path = require('path');

module.exports = {
    name: 'npm',
    description: 'Execute npm commands.',
    role: roles.Admin,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        return new Promise(resolve => {
            let output = '';
            const npm = spawn('npm', [ rest ], { shell: true, cwd: path.join(__dirname, '../../../..') });
            npm.stdout.on('data', data => {
                output = output + '\n' + data.toString();
            });

            npm.on('close', (code, signal) => {
                message.channel.send(`\`npm ${rest}\` output:\n\`\`\`${output}\`\`\``);
                resolve();
            });
        });
    }
};