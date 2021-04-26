import Discord from 'discord.js';
import { getAppSettings } from '../../config';

export const Admin = getAppSettings().discord.adminRole;

export function hasRole(message: Discord.Message, role: string) {
    // If no role is provided, the user is authorized.
    if (!role) return true;

    // If the message author is the bot owner, the user is authorized.
    const config = getAppSettings();
    if (message.author.id === config.discord.parentalUnit) return true;

    // If the channel is not a text channel, the user is not authorized.
    if (message.channel.type !== 'text') return false;

    // If the user is not a guild member, they are not authorized.
    if (!message.member) return false;

    // Otherwise, check the guild member's role cache for the supplied role.
    return message.member.roles.cache.has(role);
}