const Discord = require('discord.js');
const roles = require('../roles');
const { spawn } = require('child_process');
const path = require('path');

module.exports = {
    name: 'git',
    description: 'Execute git commands. Currently supports:\n\t* `pull` - Executes a `git pull` command.',
    role: roles.Admin,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        return new Promise(resolve => {
            if (rest === 'pull') {
                let output = '';
                const gitPull = spawn('git', [ rest ], { cwd: path.join(__dirname, '..') });
                gitPull.stdout.on('data', data => {
                    output = output + '\n' + data.toString();
                });

                gitPull.on('close', (code, signal) => {
                    message.channel.send(`\`git pull\` output:\n\`\`\`${output}\`\`\``);
                    resolve();
                });

            } else {
                message.channel.send(`\`${rest}\` is an invalid \`git\` command, or I don't know how to do it.`);
                resolve();
            }
        });
    }
};