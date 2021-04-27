import fs from 'fs';
import { getAppSettings } from './config';
let config = getAppSettings();

type CustomMessages = { playerConnected?: string, playerDied?: string, playerDisconnected?: string };
type UserLike = { id: string, characters: string[], customMessages: CustomMessages };
class User {
    private _id: string;
    private _characters: string[];
    private _customMessages: CustomMessages;

    public constructor(id: string, characterName?: string) {
        this._id = id;
        this._characters = typeof characterName === 'string' ? [ characterName ] : [];
        this._customMessages = {};
    }

    public get id() { return this._id; }
    public get characters() { return [...this._characters]; }
    public get customMessages() { return {...this._customMessages}; }

    public addCharacter(characterName: string) {
        this._characters.push(characterName);
    }

    public static fromJson(json: UserLike) {
        const user = new User(json.id);
        user._characters = json.characters;
        user._customMessages = json.customMessages;
        return user;
    }

    public static toJson(user: User): UserLike {
        return {
            id: user._id,
            characters: user._characters,
            customMessages: user._customMessages
        };
    }
}

export function getUsers() {
    let users: UserLike[] = [];
    if (fs.existsSync('data/users.json')) {
        users = JSON.parse(fs.readFileSync('data/users.json').toString());
    }

    return users.map(User.fromJson);
}

type VariableLookup = [string, string][];
type CombinedVariableLookup = [string, string, string][];
const globalVariableLookup: CombinedVariableLookup = [
    [ 'serverName', `_${config.valheim.name}_`, config.valheim.name ],
    [ ':joy:', '<:joy:831246652173844494>', 'lmao' ]
];
const textVariableLookup = () => globalVariableLookup.map<[string, string]>(([k, t, v]) => [k, t]);
const voiceVariableLookup = () => globalVariableLookup.map<[string, string]>(([k, t, v]) => [k, v]);

/**
 * 
 * @param template 
 * @param variableLookups 
 */
function fillInTemplate(template: string, variables: VariableLookup) {
    let message = template;
    variables.forEach(([k, v]) => message = message.replace(`{${k}}`, v));
    return message;
}

type CustomMessageOptions = {
    defaultIfNone?: string,
    variables?: VariableLookup
};
/**
 * @param characterName
 * @param messageType
 * @param options
 */
export function getCustomMessages(characterName: string, messageType: keyof CustomMessages, { defaultIfNone = '', variables = [] }: CustomMessageOptions = {}) {
    const user = getUsers().find(u => u.characters.indexOf(characterName) >= 0);
    if (!user) return {
        text: fillInTemplate(defaultIfNone, [...textVariableLookup(), ...variables, ['name', `_${characterName}_`]]),
        voice: fillInTemplate(defaultIfNone, [...voiceVariableLookup(), ...variables, [ 'name', characterName ]])
    };

    const messageTemplate = user.customMessages[messageType] || defaultIfNone;
    return {
        text: fillInTemplate(messageTemplate, [...textVariableLookup(), ...variables, ['name', `<@${user.id}> (_${characterName}_)`]]),
        voice: fillInTemplate(messageTemplate, [...voiceVariableLookup(), ...variables, [ 'name', characterName ]])
    };
}

/**
 * 
 * @param id 
 * @param characterName 
 */
export function addCharacter(id: string, characterName: string) {
    const users = getUsers();
    const existing = users.find(u => u.id === id);
    if (existing) {
        if (!existing.characters.find(c => c === characterName)) {
            existing.addCharacter(characterName);
        }
    } else users.push(new User(id, characterName)); //else users.push({ id, characters: [ characterName ], customMessages: {} });
    
    fs.writeFileSync('data/users.json', JSON.stringify(users.map(User.toJson)));
}

