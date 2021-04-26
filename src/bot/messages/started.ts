import * as discordBot from '../discord/bot';

export function execute(data: string) {
    require('../discord/commands/status').sendStatusEmbed(discordBot.getDefaultChannel());
}