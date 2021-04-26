import * as valheimServer from '../valheimServer';
import * as wsServer from '../wsServer';

const prefix = 'Destroying abandoned non persistent zdo ';
type ParseResult = { canHandle: boolean, data?: { id: string, name: string }};

export function parse(text: string): ParseResult {
    if (text.indexOf(prefix) === -1) return { canHandle: false };

    const prefixIndex = text.indexOf(prefix);
    const colon = text.indexOf(':', prefixIndex + prefix.length);
    const id = text.slice(prefixIndex + prefix.length, colon).trim();
    const player = valheimServer.findPlayer(id);
    if (!player) return { canHandle: false };

    return { canHandle: true, data: player };
}

export function execute(data: { id: string, name: string }) {
    valheimServer.removePlayer(data.id);
    wsServer.sendMessage('playerDisconnected', data.name);
}