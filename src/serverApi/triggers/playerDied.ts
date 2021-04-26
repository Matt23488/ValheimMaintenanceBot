import * as wsServer from "../wsServer";

const prefix = 'Got character ZDOID from ';
type ParseResult = { canHandle: boolean, data?: string};

export function parse(text: string): ParseResult {
    if (text.indexOf(prefix) === -1) return { canHandle: false };

    const prefixIndex = text.indexOf(prefix);
    const firstColon = text.indexOf(':', prefixIndex + prefix.length);
    const secondColon = text.indexOf(':', firstColon + 1);
    const player = {
        id: text.slice(firstColon + 1, secondColon).trim(),
        name: text.slice(prefixIndex + prefix.length, firstColon).trim()
    };

    if (player.id !== '0') return { canHandle: false };
    return { canHandle: true, data: player.name };
}

export function execute(data: string) {
    wsServer.sendMessage('playerDied', data);
}