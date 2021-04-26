import * as discordBot from '../discord/bot';

export function execute(data: string) {
    discordBot.getDefaultChannel().send(`The Valheim Server reported an error:\n\`\`\`${data}\`\`\``);
}