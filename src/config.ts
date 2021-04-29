import fs from 'fs';

type EnemyRaid = { name: string, message: string, image: string, duration: number };
type ValheimSettings = { serverWorkingDirectory: string, serverBatchFile: string, serverExecutable: string, backupDir: string, name: string, world: string, port: number, password: string, public: 0 | 1 };
type DiscordSettings = { appToken: string, commandPrefix: string, defaultTextChannel: string, defaultVoiceChannel: string, parentalUnit: string, adminRole: string };
type AppSettings = { valheim: ValheimSettings, discord: DiscordSettings };

interface SettingsTypeMap {
    appsettings: AppSettings;
    attack: EnemyRaid[];
}

/**
 * Returns the requested settings.
 * @param type The desired settings
 * @returns An object containing the requested settings.
 */
export function getSettings<T extends keyof SettingsTypeMap>(type: T): SettingsTypeMap[T] {
    return JSON.parse(fs.readFileSync(`data/${type}.json`).toString());
}