import * as valheimServer from "../valheimServer";
import * as wsServer from "../wsServer";

const prefix = 'Got character ZDOID from ';

type ParseResult = { canHandle: boolean, data?: { id: string, name: string }};

export function parse(text: string): ParseResult {
    if (text.indexOf(prefix) === -1) return { canHandle: false };

    const prefixIndex = text.indexOf(prefix);
    const firstColon = text.indexOf(':', prefixIndex + prefix.length);
    const secondColon = text.indexOf(':', firstColon + 1);
    const newPlayer = {
        id: text.slice(firstColon + 1, secondColon).trim(),
        name: text.slice(prefixIndex + prefix.length, firstColon).trim()
    };

    // Died
    if (newPlayer.id === '0') return { canHandle: false };

    // Respawned
    const existing = valheimServer.findPlayer(newPlayer.id);
    if (existing) return { canHandle: false };

    return { canHandle: true, data: newPlayer };
}

export function execute(data: { id: string, name: string }) {
    valheimServer.addPlayer(data.id, data.name);
    wsServer.sendMessage('playerConnected', data.name);
}