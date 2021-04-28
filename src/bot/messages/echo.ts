import { ClientMessage } from '../../commonTypes';
import * as discordBot from '../discord/bot';

export const message: ClientMessage<'echo'> = {
    execute: data => {
        discordBot.getDefaultChannel().send(data);
        discordBot.speak(data);
    }
};