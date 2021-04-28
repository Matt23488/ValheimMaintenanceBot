import * as discordBot from '../discord/bot';
import { getCustomMessages } from '../../Users';
import { ClientMessage } from '../../commonTypes';

export const message: ClientMessage<'playerDied'> = {
    execute: data => {
        const messages = getCustomMessages(data, 'playerDied', { defaultIfNone: '{name} has died. F in the chat.' });
        discordBot.getDefaultChannel().send(messages.text);
        discordBot.speak(messages.voice);
    }
};