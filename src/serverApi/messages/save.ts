import fs from 'fs';
import path from 'path';
import * as valheimServer from '../valheimServer'

export const prefix = 'save';

type Data = { name: valheimServer.BufferName, outFileName?: string, author: string };
export function execute(data: Data) {
    const buffer = valheimServer.getBuffer(data.name);

    const output = buffer.toArray().join('\n');
    if (data.outFileName) fs.writeFileSync(path.join(__dirname, `../../../logs/${data.author}_${data.outFileName}.txt`), output);
    return Promise.resolve(output);
}