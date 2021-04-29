# Valheim Maintenance Bot

A Discord Bot to manage your Valheim Server.

[![GitHub last commit](https://img.shields.io/github/last-commit/Matt23488/ValheimMaintenanceBot.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Matt23488/ValheimMaintenanceBot/commits/main)
[![GitHub issues](https://img.shields.io/github/issues/Matt23488/ValheimMaintenanceBot.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Matt23488/ValheimMaintenanceBot/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/Matt23488/ValheimMaintenanceBot.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Matt23488/ValheimMaintenanceBot/pulls)

---

## 1. About

Valheim Maintenance Bot is a way to host a Valheim Server while providing interactivity with your Discord server.

Because this bot is tied to a Valheim Server instance, you will need to go through the process of creating a Discord application to serve as the login for your instance of this repository. For more information, please visit [the Discord Developer Portal](https://discord.com/developers/applications).

## 2. Features

Here is an overview of the features.

#### 2.1 Discord Bot

Part of the repository is a NodeJS application responsible for logging into Discord as your bot application, using [discord.js](https://npmjs.com/package/discord.js). As with most Discord bots, ours supports a variety of commands:

> TODO: provide parameter syntax for these

- `!backup` - Can be used to list and create backups of your Valheim worlds.
- `!git` - Allows the bot administrator to execute `git pull` on the repository without having to RDP into the server machine. Mostly for my convenience while making changes on the fly.
- `!haldor` - Reads your Valheim world file and displays Haldor's coordinates, or the ten possible locations if he has not been visited yet.
- `!help` - Provides a list of commands and information related to them.
- `!kill` - Logs the bot out of Discord and ends the process.
- `!npm` - Allows the bot administrator to execute `npm` commands. Mostly for my convenience while making changes on the fly.
- `!ping` - A simple bot responsiveness test command.
- `!player` - Allows Discord users to register their Valheim character name(s) with the bot to provide more interactivity between the Valheim Server and Discord.
- `!reboot` - Allows the bot administrator to reboot the Bot's NodeJS process, the Valheim Server process, or the host machine.
- `!save` - Provides some output from the Valheim Server executable's `stdout` or `stderr` streams and optionally saves them to a text file on the host machine.
- `!start` - Starts the Valheim Server NodeJS process, if it's not already running.
- `!status` - Displays the status of the Valheim Server. If the server is up, it will display the IP information, uptime, and connected players and their respective uptimes.
- `!stop` - Stops the Valheim Server. Issues `SIGINT` to the process, which triggers the server to save the world and exit properly. In short, it ensures the world is saved before shutting down.
- `!trigger` - Allows the bot administrator to test server messages without having to trigger the event in the game.
- `!voice` - Allows toggling voice features on and off.

The bot also receives messages from the server NodeJS process, which I have outlined below. When this happens, the bot will announce something to the configured Discord channel. If voice is enabled, the bot will also speak into the active configured voice channel.

#### 2.2 Valheim Server