import * as discordBot from '../discord/bot';
import { getCustomMessages } from '../../Users';
import { ClientMessage } from '../../commonTypes';

export const message: ClientMessage<'playerDisconnected'> = {
    execute: data => {
        const messages = getCustomMessages(data, 'playerDisconnected', { defaultIfNone: '{name} has left {serverName}.' });
        discordBot.getDefaultChannel().send(messages.text);
        discordBot.speak(messages.voice);
    }
};