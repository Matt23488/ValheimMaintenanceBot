import { ClientMessage } from '../../commonTypes';
import * as discordBot from '../discord/bot';
import { command } from '../discord/commands/status';

export const message: ClientMessage<'started'> = {
    execute: data => {
        command.sendStatusEmbed(discordBot.getDefaultChannel());
    }
};