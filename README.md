# Valheim Maintenance Bot

A Discord Bot to manage your Valheim Server.

[![GitHub last commit](https://img.shields.io/github/last-commit/Matt23488/ValheimMaintenanceBot.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Matt23488/ValheimMaintenanceBot/commits/main)
[![GitHub issues](https://img.shields.io/github/issues/Matt23488/ValheimMaintenanceBot.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Matt23488/ValheimMaintenanceBot/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/Matt23488/ValheimMaintenanceBot.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Matt23488/ValheimMaintenanceBot/pulls)

---

## 1. About

Valheim Maintenance Bot is a way to host a Valheim Server while providing interactivity with your Discord server.

Because this bot is tied to a Valheim Server instance, you will need to go through the process of creating a Discord application to serve as the login for your instance of this repository. For more information, please visit [the Discord Developer Portal](https://discord.com/developers/applications).

---

## 2. Features

The repository is made up of two separate pieces that interact with each other through Web Sockets (ws):

### Discord Bot

The first piece is a NodeJS application responsible for logging into Discord as your bot application, using [discord.js](https://npmjs.com/package/discord.js). As with most Discord bots, ours supports a variety of commands ranging from simple starting/stopping the Valheim server to reading your Valheim world binary to provide insight into the location of a certain merchant.

The bot also receives messages from the server NodeJS process, which I have outlined below. When this happens, the bot will announce something to the configured Discord channel. If voice is enabled, the bot will also speak in the active configured voice channel.

### Valheim Server

The second piece is a NodeJS application responsible for maintaining the Valheim Server process. It launches the actual exectuable directly as a child process, so that it can spy on `stdout` and `stderr`. Luckily, the server executable outputs a lot of information which is used to detect events that happen in the game. When such an event is detected, it is forwarded to all connected ws clients (in this case just our bot process) and the bot passes along the information to Discord.

---

## 3. Getting Started

To use the bot, you must first have a server that you have admin access to, or otherwise can install software on. Valheim supports Windows and Linux, but currently this repository is specific to Windows hosts only. **If you have the ability to modify the code to be platform-independent, feel free to submit a pull request.**

You'll also need to set up a Discord bot application, as I mentioned in the `About` section above. And of course you'll need to have a Discord server for your bot to join.

First off, install Steam and the Valheim Dedicated Server. Don't worry about modifying the `start_headless_server.bat` file and all that, this repository replaces that as the entry point. You'll also need to make sure that you get your world files in the correct place on your server. I might add more information on that later, but for now it's easy to find out how to do that. If you're looking into using this repository, you probably don't need help figuring that out.

The other thing you'll need to install is of course NodeJS. I have 12.16.2 installed, but I'm sure earlier versions work. But if not just update to at least this version. That should take care of `npm` as well.

I have included several useful scripts in the `package.json` file, but first you'll need to run `npm i` in the root of the repository. There are two ways to transpile the TypeScript code: `npm run build` and `npm run publish`. They both run `tsc` targeting different `tsconfig.json` files. Right now the only difference is that `npm run build` generates source maps that allow you to properly debug the TypeScript code directly. But if you don't need debugging features, you can run `npm run publish` to just generate the JavaScript code.

Once you've done that, you will need to create a file in the `data` directory called `appsettings.json`, which should match this type:

```ts
type AppSettings = {
     valheim: {
          serverWorkingDirectory: string, // "C:/Program Files (x86)/Steam/steamapps/common/Valheim dedicated server/" or equivalent
          serverBatchFile: 'start_headless_server.bat', // Used to parse out an environment variable that the executable expects
          serverExecutable: 'valheim_server.exe',
          backupDir: string, // repo subdir to store your world backups
          name: string, // The desired name of your Valheim server
          world: string, // The name of the world you wish to host
          port: number, // The port to host. Valheim uses 2456 by default.
          password: string, // The password you wish to use on connection.
          public: 0 | 1, // Show your server in the community list in Valheim or not
     },
     discord: {
          appToken: string, // Your Discord app token
          commandPrefix: string, // Whatever symbol you want to use to prefix commands. I use `!` personally.
          defaultTextChannel: string, // The ID of the text channel in Discord the bot will interact with.
          defaultVoiceChannel: string, // The ID of the voice channel in Discord the bot will interact with.
          parentalUnit: string, // Your own Discord ID, assuming you reading this will be using this code yourself.
          adminRole: string, // Commands support allowing `admins` only, this is the ID in Discord for your equivalent role you want to use
     }
}
```

If you have configured everything correctly, you can run the `startbot.bat` script directly to start the bot process. You can manually run `startserver.bat` as well if you wish, though issuing the `!start` command to the bot via Discord does the same thing.

## 4. Random Banter

This project started off as just an idea I had one day after we started playing Valheim and I set up a dedicated server. I originally wrote it all in vanilla JavaScript, but grew tired of all the type annotations in jsdoc format and decided to see if converting the project to TypeScript would be better. So I spent the time to convert what I had, and decided I did prefer it.

My past experiences with TypeScript are that it's generally very nice to work with but it can get in the way if you don't fully understand how to use the type system, and especially when using third-party dependencies. However this time around I didn't run into any dependency issues, and I got pretty deep in the weeds with some advanced features of TypeScript that turned out to work really nice with the way I had composed various components of the code.

TypeScript gives you an incredible amount of control over your APIs and I've learned a lot converting this project to TypeScript.

Feel free to reach out or file an issue or whatever if there's anything I missed and need to include in this README file. Or add it yourself and submit a pull request if you prefer that.