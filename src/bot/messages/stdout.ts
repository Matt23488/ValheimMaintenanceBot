import { ClientMessage } from '../../commonTypes';

export const message: ClientMessage<'stdout'> = {
    execute: data => {
        // This does nothing, but I can maybe add functionality here at some point since the
        // server always sends the `stdout` output back to the bot
    }
};