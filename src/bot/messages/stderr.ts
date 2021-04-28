import { ClientMessage } from '../../commonTypes';
import * as discordBot from '../discord/bot';

export const message: ClientMessage<'stderr'> = {
    execute: data => {
        discordBot.getDefaultChannel().send(`The Valheim Server reported an error:\n\`\`\`${data}\`\`\``);
    }
};