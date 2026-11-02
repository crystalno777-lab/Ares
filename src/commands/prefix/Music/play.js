import { MessageFlags, ContainerBuilder, SeparatorSpacingSize, PermissionFlagsBits } from 'discord.js';
import { Queue } from '../../../utils/Queue.js';
import EMOJIS from '../../../utils/emojis.js';
import { isSpotifyQuery, resolveSpotifyQuery, isEmptyLoadResult } from '../../../utils/spotifyResolver.js';

export default {
    name: 'play',
    aliases: [],
    description: 'Play a song (temporarily unavailable)',
    async execute(message) {
        await message.reply('Coming soon.');
    }
};
