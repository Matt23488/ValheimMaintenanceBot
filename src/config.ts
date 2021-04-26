import fs from 'fs';

type EnemyRaid = { name: string, message: string, image: string, duration: number };
type ValheimSettings = { serverWorkingDirectory: string, serverBatchFile: string, serverExecutable: string, backupDir: string, name: string, world: string, port: number, password: string, public: 0 | 1, attacks: EnemyRaid[] };
type DiscordSettings = { commandPrefix: string, defaultTextChannel: string, defaultVoiceChannel: string, parentalUnit: string, adminRole: string };
type AppSettings = { valheim: ValheimSettings, discord: DiscordSettings };
type AppSecrets = { appToken: string };

export function getAppSettings() {
    return JSON.parse(fs.readFileSync('data/appsettings.json').toString()) as AppSettings;
}

export function getAppSecrets() {
    return JSON.parse(fs.readFileSync('data/appsecrets.json').toString()) as AppSecrets;
}