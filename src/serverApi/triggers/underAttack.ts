import * as wsServer from '../wsServer';

const prefix = 'Random event set:';
type ParseResult = { canHandle: boolean, data?: string };

export function parse(text: string): ParseResult {
    const prefixIndex = text.indexOf(prefix);
    if (prefixIndex === -1) return { canHandle: false };

    const data = text.slice(prefixIndex + prefix.length, text.indexOf('\n')).trim();
    wsServer.sendMessage('echo', `\`\`\`\nDEBUG\ntext: ${text}\nprefixIndex: ${prefixIndex}\ndata: ${data}\`\`\``);
    return { canHandle: true, data };
}

export function execute(data: string) {
    wsServer.sendMessage('underAttack', data);
}