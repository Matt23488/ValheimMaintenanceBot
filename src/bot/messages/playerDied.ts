import * as discordBot from '../discord/bot';
import { getCustomMessages } from '../../Users';

export function execute(data: string) {
    const messages = getCustomMessages(data, 'playerDied', { defaultIfNone: '{name} has died. F in the chat.' });
    discordBot.getDefaultChannel().send(messages.text);
    discordBot.speak(messages.voice);
}