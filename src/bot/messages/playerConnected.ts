import * as discordBot from '../discord/bot';
import { getCustomMessages } from '../../Users';
import { ClientMessage } from '../../commonTypes';

export const message: ClientMessage<'playerConnected'> = {
    execute: data => {
        const messages = getCustomMessages(data, 'playerConnected', { defaultIfNone: '{name} has joined {serverName}!' });
        discordBot.getDefaultChannel().send(messages.text);
        discordBot.speak(messages.voice);
    }
};