import fs from 'fs';
import path from 'path';
import { ServerMessage } from '../../commonTypes';
import * as valheimServer from '../valheimServer'

export const message: ServerMessage<'save'> = {
    prefix: 'save',
    execute: data => {
        const buffer = valheimServer.getBuffer(data.name);

        const output = buffer.toArray().join('\n');
        if (data.outFileName) fs.writeFileSync(path.join(__dirname, `../../../logs/${data.author}_${data.outFileName}.txt`), output);
        return Promise.resolve(output);
    }
};