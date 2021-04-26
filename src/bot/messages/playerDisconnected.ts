import * as discordBot from '../discord/bot';
import { getCustomMessages } from '../../utilities';

export function execute(data: string) {
    const messages = getCustomMessages(data, 'playerDisconnected', { defaultIfNone: '{name} has left {serverName}.' });
    discordBot.getDefaultChannel().send(messages.text);
    discordBot.speak(messages.voice);
}