import * as discordBot from '../discord/bot';

export function execute(data: string) {
    discordBot.getDefaultChannel().send(data);
    discordBot.speak(data);
}