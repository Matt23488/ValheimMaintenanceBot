import * as discordBot from '../discord/bot';
import { getCustomMessages } from '../../Users';

export function execute(data: string) {
    const messages = getCustomMessages(data, 'playerConnected', { defaultIfNone: '{name} has joined {serverName}!' });
    discordBot.getDefaultChannel().send(messages.text);
    discordBot.speak(messages.voice);
}