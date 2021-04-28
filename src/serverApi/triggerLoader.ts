import fs from 'fs';
import path from 'path';
import { ServerTriggerDynamic } from '../commonTypes';

export function handleOutput (output: string) {
    const triggers = fs.readdirSync(path.join(__dirname, 'triggers')).filter(f => f.endsWith('.js')).map<ServerTriggerDynamic>(f => require(path.join(__dirname, 'triggers', f)).trigger);

    for (let trigger of triggers) {
        const parsed = trigger.parse(output);
        if (!parsed.canHandle) continue;

        trigger.execute(parsed.data);
    }
}