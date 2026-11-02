import { ContainerBuilder, MessageFlags, SeparatorSpacingSize, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import EMOJIS from '../../../utils/emojis.js';

const name = 'help';
const aliases = ['h', 'commands', 'cmds'];
const description = 'View all commands and categories.';
const usage = 'help [category|command]';
const category = 'General';

const getCategoryEmoji = (cat) => {
    const emojiMap = {
        'General': '<:emoji_9:1566528847464108183>',
        'Moderation': '<:emoji_76:1566533991639678986>',
        'Fun': '<:emoji_6:1566530216359108629>',
        'Music': '<:emoji_12:1566529131200512120>',
        'Configuration': '<a:gears:1563970627482947716>',
        'Leveling': '<:emoji_8:1566528799359635557>',
        'Server': '<:emoji_20:1566529594280910868>',
        'Automod': '<a:xieron_stolen_emoji_1793006358:1566530937020489910>',
        'Antinuke': '<:emoji_12:1566529085235134695>',
        'Anti Raid': '<:emoji_1:1566528388733337600>',
        'Logs': '<:emoji_10:1566528971632279712>',
        'Welcome': '<:MH_Blush:1566534747067515043>',
        'Tickets': '<:emoji_18:1566529464379248640>',
        'Giveaways': '<:emoji_29:1566533478902800464>',
        'Birthday': '<:emoji_4:1566528582799458364>',
        'Starboard': '<:emoji_16:1566529308237889617>',
        'Stats': '<:emoji_17:1566529370330366123>',
        'Custom Roles': '<:emoji_7:1566528746461331606>',
        'Voice Commands': '<:emoji_19:1566529535313191072>',
        'Bumpreminder': '<:emoji_5:1566528650411647178>',
        'Bot Owner': EMOJIS.owner || '👑',
        'Miscellaneous': '<:emoji_5:1566528650411647178>'
    };
    return emojiMap[cat] || '<:emoji_5:1566528650411647178>';
};

const CATEGORY_DESCRIPTIONS = {
    'General': 'Basic utility commands',
    'Moderation': 'Server moderation tools',
    'Fun': 'Fun and entertainment commands',
    'Music': 'Music player controls',
    'Configuration': 'Server configuration & tools',
    'Leveling': 'XP and ranking system',
    'Server': 'Server configuration',
    'Automod': 'Automatic moderation',
    'Antinuke': 'Server protection',
    'Anti Raid': 'Raid prevention',
    'Logs': 'Event logging',
    'Welcome': 'Welcome messages',
    'Tickets': 'Support tickets',
    'Giveaways': 'Giveaway management',
    'Birthday': 'Birthday tracking',
    'Starboard': 'Star message highlights',
    'Stats': 'Server statistics',
    'Custom Roles': 'Custom role management',
    'Voice Commands': 'Voice channel controls',
    'BumpReminder': 'Bump reminders',
    'Bot Owner': 'Bot owner commands',
    'miscellaneous': 'Miscellaneous commands'
};

const SUBCOMMAND_REGISTRY = {

    'antiraid': {
        'config': 'View current antiraid settings',
        'enable': 'Turn on antiraid protection',
        'disable': 'Turn off antiraid protection',
        'massjoin': 'Configure mass join detection',
        'avatar': 'Block users with default avatars',
        'newaccounts': 'Set minimum account age',
        'state': 'Check antiraid status',
        'whitelist': 'Manage whitelisted users',
        'log': 'Set antiraid log channel'
    },

    'automod': {
        'on': 'Enable automod system',
        'off': 'Disable automod system',
        'config': 'View automod configuration',
        'module': 'Toggle specific modules',
        'preset': 'Apply preset configurations',
        'ignore': 'Ignore channel/role from automod',
        'unignore': 'Remove from ignore list',
        'words': 'Manage banned words list',
        'logchannel': 'Set automod log channel',
        'stats': 'View automod statistics',
        'strikes': 'Configure strike system',
        'notify': 'Toggle violation notifications',
        'reset': 'Reset all automod settings'
    },

    'antinuke': {
        'wizard': 'Interactive setup wizard',
        'setup': 'Quick configuration setup',
        'enable': 'Enable antinuke protection',
        'disable': 'Disable antinuke protection',
        'preset': 'Apply security presets',
        'admin': 'Add trusted admin',
        'admins': 'List all trusted admins',
        'extraowner': 'Add extra owner',
        'extraowners': 'List extra owners',
        'whitelist': 'Add user to whitelist',
        'list': 'View whitelisted users',
        'config': 'View current configuration',
        'protocol': 'Enable specific protection',
        'unprotocol': 'Disable specific protection',
        'protocol-list': 'List all protections',
        'logs': 'Set antinuke log channel',
        'punishment': 'Set punishment type',
        'threshold': 'Set action thresholds',
        'strictbot': 'Toggle strict bot mode',
        'reset': 'Reset antinuke settings'
    },

    'welcome': {
        'add': 'Add welcome channel',
        'remove': 'Remove welcome channel',
        'list': 'List configured channels',
        'config': 'Configure message settings',
        'toggle': 'Toggle welcome on/off',
        'enable': 'Enable welcome messages',
        'disable': 'Disable welcome messages',
        'test': 'Send test welcome message',
        'reset': 'Reset welcome settings',
        'show': 'Show current configuration'
    },
    'goodbye': {
        'add': 'Add goodbye channel',
        'remove': 'Remove goodbye channel',
        'list': 'List configured channels',
        'config': 'Configure message settings',
        'toggle': 'Toggle goodbye on/off',
        'enable': 'Enable goodbye messages',
        'disable': 'Disable goodbye messages',
        'test': 'Send test goodbye message',
        'reset': 'Reset goodbye settings',
        'show': 'Show current configuration'
    },

    'ticket': {
        'create': 'Create a new ticket',
        'new': 'Open a new support ticket',
        'open': 'Open a ticket channel',
        'setup': 'Configure ticket system',
        'panel': 'Create ticket panel',
        'removepanel': 'Remove ticket panel',
        'add': 'Add user to ticket',
        'remove': 'Remove user from ticket',
        'claim': 'Claim ticket as staff',
        'close': 'Close current ticket',
        'reopen': 'Reopen closed ticket',
        'rename': 'Rename ticket channel',
        'transcript': 'Save ticket transcript',
        'delete': 'Permanently delete ticket',
        'list': 'List all tickets',
        'stats': 'View ticket statistics'
    },

    'giveaway': {
        'start': 'Start a new giveaway',
        'end': 'End giveaway early',
        'reroll': 'Reroll giveaway winners',
        'cancel': 'Cancel active giveaway',
        'list': 'List all giveaways',
        'edit': 'Edit giveaway settings'
    },

    'starboard': {
        'unlock': 'Unlock starboard system',
        'enable': 'Enable starboard',
        'lock': 'Lock starboard system',
        'disable': 'Disable starboard',
        'set': 'Set starboard channel',
        'channel': 'Change starboard channel',
        'emoji': 'Configure star emojis',
        'selfstar': 'Toggle self-starring',
        'color': 'Set embed color',
        'timestamp': 'Toggle timestamps',
        'jumpurl': 'Toggle jump links',
        'attachments': 'Toggle attachments',
        'ignore': 'Ignore channel/role',
        'config': 'View configuration',
        'reset': 'Reset starboard settings'
    },

    'birthday': {
        'set': 'Set your birthday',
        'view': 'View a user\'s birthday',
        'upcoming': 'See upcoming birthdays',
        'remove': 'Remove your birthday',
        'setup': 'Configure birthday system',
        'check': 'Check birthday status',
        'config': 'View birthday settings'
    },

    'customrole': {
        'add': 'Create a new role alias',
        'remove': 'Delete a role alias',
        'view': 'View all role aliases',
        'list': 'List configured aliases',
        'reqrole': 'Set required role to use'
    },

    'noprefix': {
        'add': 'Grant no-prefix access',
        'remove': 'Revoke no-prefix access',
        'list': 'List no-prefix users',
        'status': 'Check no-prefix status'
    },

    'bumpreminder': {
        'channel': 'Set bump channel',
        'enable': 'Enable bump reminders',
        'disable': 'Disable bump reminders',
        'thankyou': 'Set thank you message',
        'message': 'Set reminder message',
        'autolock': 'Toggle channel auto-lock',
        'autoclean': 'Toggle auto-cleanup',
        'config': 'View configuration'
    },

    'logs': {
        'search': 'Search through server logs',
        'export': 'Export logs to file',
        'ignore': 'Ignore channel from logging',
        'status': 'View logging status',
        'purge': 'Clear old log entries',
        'stats': 'View logging statistics'
    },

    'trigger': {
        'add': 'Add a new trigger',
        'remove': 'Remove a trigger',
        'list': 'List all triggers',
        'edit': 'Edit trigger response',
        'matchmode': 'Set matching mode',
        'toggle': 'Enable/disable trigger',
        'info': 'View trigger details',
        'plaintext': 'Toggle plain text mode'
    },

    'reaction': {
        'add': 'Add reaction trigger',
        'remove': 'Remove reaction trigger',
        'list': 'List all reaction triggers',
        'messages': 'React to all messages in channel',
        'messages list': 'List channels with auto-reactions',
        'messages remove': 'Remove channel reactions',
        'reset': 'Remove all reaction triggers'
    }
};

function getSubcommands(cmd) {

    const registeredSubs = SUBCOMMAND_REGISTRY[cmd.name.toLowerCase()];
    if (registeredSubs && typeof registeredSubs === 'object') {
        return Object.entries(registeredSubs).map(([subName, subDesc]) => ({
            name: `${cmd.name} ${subName}`,
            description: subDesc,
            parent: cmd.name
        }));
    }

    if (cmd.usage) {
        const match = cmd.usage.match(/<([^>]+\|[^>]+)>/);
        if (match) {
            const subs = match[1].split('|');
            return subs.map(sub => ({
                name: `${cmd.name} ${sub.trim()}`,
                description: cmd.description,
                parent: cmd.name
            }));
        }
    }

    return [{ name: cmd.name, description: cmd.description, parent: null }];
}

function getTotalCommandCount(grouped) {
    let total = 0;
    for (const cat of Object.keys(grouped)) {
        if (cat === 'Bot Owner') continue;
        for (const cmd of grouped[cat]) {
            total += getSubcommands(cmd).length;
        }
    }
    return total;
}

function getCategoryCommandCount(commands) {
    let total = 0;
    for (const cmd of commands) {
        total += getSubcommands(cmd).length;
    }
    return total;
}

function groupCommandsByCategory(client) {
    const grouped = {};

    const normalizeCategory = (cat) => {
        if (!cat) return 'General';

        return cat.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    client.prefixCommands.forEach((cmd) => {
        const cat = normalizeCategory(cmd.category);
        if (!grouped[cat]) {
            grouped[cat] = [];
        }
        grouped[cat].push(cmd);
    });

    for (const cat of Object.keys(grouped)) {
        grouped[cat].sort((a, b) => a.name.localeCompare(b.name));
    }

    return grouped;
}

function buildMainMenu(client, prefix, grouped, expired = false) {
    const container = new ContainerBuilder();

    if (expired) {
        container.addTextDisplayComponents(td => td.setContent(
            `# ${EMOJIS.error || '<a:Emo_Loading:1566551264924405931>'} Help Menu Expired`
        ));
        container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small));
        container.addTextDisplayComponents(td => td.setContent(
            `This help menu has expired.\nUse \`${prefix}help\` to open a new one.`
        ));
        return container;
    }

    container.addTextDisplayComponents(td => td.setContent(
        `# ${EMOJIS.help || '<:musafir_flower_purple:1566549613215883354>'} ${client.user.username} Help`
    ));

    container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small));

    const totalCommands = getTotalCommandCount(grouped);
    container.addTextDisplayComponents(td => td.setContent(
        `**${EMOJIS.commands || '📜'} Commands:** ${totalCommands}`
    ));

    container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    let categoryList = `**${EMOJIS.folder || '<:emoji_5:1566528650411647178>'} Categories**\n\n`;

    const sortedCategories = Object.keys(grouped)
        .filter(cat => cat !== 'Bot Owner')
        .sort((a, b) => a.localeCompare(b));

    for (const cat of sortedCategories) {
        const emoji = getCategoryEmoji(cat);
        const cmdCount = getCategoryCommandCount(grouped[cat]);
        categoryList += `${emoji} **${cat}** — ${cmdCount} command${cmdCount !== 1 ? 's' : ''}\n`;
    }

    categoryList += `\n*Use \`${prefix}help <category>\` to view commands*`;

    container.addTextDisplayComponents(td => td.setContent(categoryList));

    container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    container.addTextDisplayComponents(td => td.setContent(
        `**${EMOJIS.lightbulb || '<a:1202lightyellowcrown:1566531939752747078>'} Quick Tips**\n` +
        `> **${prefix}help <command>** — View command details\n` +
        `> **${prefix}help <category>** — View category commands`
    ));

    const seenValues = new Set();
    const selectOptions = [];

    for (const cat of sortedCategories.slice(0, 25)) {
        const emoji = getCategoryEmoji(cat);
        const value = cat.toLowerCase().replace(/\s+/g, '_');

        if (seenValues.has(value)) continue;
        seenValues.add(value);

        selectOptions.push({
            label: cat,
            value: value,
            description: `${getCategoryCommandCount(grouped[cat])} commands`,
            emoji: typeof emoji === 'string' && emoji.match(/^\d+$/) ? undefined : emoji
        });
    }

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('help_category_select')
        .setPlaceholder('Select a category...')
        .addOptions(selectOptions);

    container.addActionRowComponents(new ActionRowBuilder().addComponents(selectMenu));

    const supportUrl = client.config?.supportServer;
    const websiteUrl = client.config?.website;

    if (supportUrl || websiteUrl) {
        const buttons = [];
        if (supportUrl) {
            buttons.push(
                new ButtonBuilder()
                    .setLabel('Support')
                    .setStyle(ButtonStyle.Link)
                    .setURL(supportUrl)
                    .setEmoji('💬')
            );
        }
        if (websiteUrl) {
            buttons.push(
                new ButtonBuilder()
                    .setLabel('Website')
                    .setStyle(ButtonStyle.Link)
                    .setURL(websiteUrl)
                    .setEmoji('🌐')
            );
        }
        container.addActionRowComponents(new ActionRowBuilder().addComponents(...buttons));
    }

    return container;
}

function buildCategoryPage(client, prefix, categoryName, commands, expired = false, pageNum = 0) {
    const container = new ContainerBuilder();
    const emoji = getCategoryEmoji(categoryName);
    const desc = CATEGORY_DESCRIPTIONS[categoryName] || 'Commands';

    if (expired) {
        container.addTextDisplayComponents(td => td.setContent(
            `# ${EMOJIS.error || '<a:Emo_Loading:1566551264924405931>'} Help Menu Expired`
        ));
        container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small));
        container.addTextDisplayComponents(td => td.setContent(
            `This help menu has expired.\nUse \`${prefix}help\` to open a new one.`
        ));
        return container;
    }

    container.addTextDisplayComponents(td => td.setContent(
        `# ${emoji} ${categoryName}`
    ));

    container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small));

    const cmdCount = getCategoryCommandCount(commands);
    container.addTextDisplayComponents(td => td.setContent(
        `*${desc}*\n` +
        `**${cmdCount}** command${cmdCount !== 1 ? 's' : ''} available`
    ));

    container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    const allCommands = [];
    for (const cmd of commands) {
        const subs = getSubcommands(cmd);
        for (const sub of subs) {
            allCommands.push({
                name: sub.name,
                description: sub.description || 'No description',
                parent: sub.parent
            });
        }
    }

    const page = typeof pageNum === 'number' ? pageNum : 0;
    const perPage = 10;
    const totalPages = Math.ceil(allCommands.length / perPage);
    const startIdx = page * perPage;
    const endIdx = Math.min(startIdx + perPage, allCommands.length);
    const pageCommands = allCommands.slice(startIdx, endIdx);

    const arrow = EMOJIS.giveawayarrow || '>';
    let commandList = '';
    for (const cmd of pageCommands) {

        const shortDesc = cmd.description.length > 50
            ? cmd.description.slice(0, 47) + '...'
            : cmd.description;
        commandList += `${arrow} **${prefix}${cmd.name}** — ${shortDesc}\n`;
    }

    container.addTextDisplayComponents(td => td.setContent(
        `**${EMOJIS.commands || '📜'} Commands**\n\n${commandList || '*No commands*'}`
    ));

    container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    if (totalPages > 1) {
        container.addTextDisplayComponents(td => td.setContent(
            `📄 Page **${page + 1}**/${totalPages} • Use \`${prefix}help <command>\` for details`
        ));
    } else {
        container.addTextDisplayComponents(td => td.setContent(
            `*Use \`${prefix}help <command>\` for detailed info*`
        ));
    }

    const categoryKey = categoryName.toLowerCase().replace(/\s+/g, '_');

    const parseButtonEmoji = (emojiStr) => {
        const match = emojiStr?.match(/<(a)?:(\w+):(\d+)>/);
        if (match) {
            return { id: match[3], name: match[2], animated: !!match[1] };
        }
        return emojiStr;
    };

    const prevButton = new ButtonBuilder()
        .setCustomId(`help_page_${categoryKey}_${page - 1}`)
        .setStyle(ButtonStyle.Primary)
        .setEmoji(parseButtonEmoji(EMOJIS.pageprevious) || '◀️')
        .setDisabled(page <= 0);

    const homeButton = new ButtonBuilder()
        .setCustomId('help_back_main')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(parseButtonEmoji(EMOJIS.homepage) || '🏠');

    const nextButton = new ButtonBuilder()
        .setCustomId(`help_page_${categoryKey}_${page + 1}`)
        .setStyle(ButtonStyle.Primary)
        .setEmoji(parseButtonEmoji(EMOJIS.pagenext) || '▶️')
        .setDisabled(page >= totalPages - 1);

    container.addActionRowComponents(new ActionRowBuilder().addComponents(prevButton, homeButton, nextButton));

    return container;
}

function buildCommandPage(client, prefix, cmd) {
    const container = new ContainerBuilder();
    const emoji = getCategoryEmoji(cmd.category);

    container.addTextDisplayComponents(td => td.setContent(
        `# ${emoji} ${prefix}${cmd.name}`
    ));

    container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small));

    let content = `*${cmd.description || 'No description available'}*\n\n`;
    content += `**Category:** ${cmd.category || 'General'}\n`;
    content += `**Usage:** \`${prefix}${cmd.usage || cmd.name}\`\n`;

    if (cmd.aliases && cmd.aliases.length > 0) {
        content += `**Aliases:** ${cmd.aliases.map(a => `\`${a}\``).join(', ')}\n`;
    }

    if (cmd.cooldown) {
        content += `**Cooldown:** ${cmd.cooldown} seconds\n`;
    }

    const subs = getSubcommands(cmd);
    if (subs.length > 1) {
        content += `\n**Subcommands:**\n`;
        for (const sub of subs) {
            content += `> \`${prefix}${sub.name}\`\n`;
        }
    }

    container.addTextDisplayComponents(td => td.setContent(content));

    container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    const backButton = new ButtonBuilder()
        .setCustomId('help_back_main')
        .setLabel('Main Menu')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🏠');

    const categoryButton = new ButtonBuilder()
        .setCustomId(`help_category_${(cmd.category || 'General').toLowerCase().replace(/\s+/g, '_')}`)
        .setLabel(cmd.category || 'General')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('<:emoji_5:1566528650411647178>');

    container.addActionRowComponents(new ActionRowBuilder().addComponents(backButton, categoryButton));

    return container;
}

async function execute(message, args, client) {

    let prefix = client.prefix || '.';
    try {
        const guildData = await client.db.findOne({ guildId: message.guildId });
        if (guildData?.prefix) {
            prefix = guildData.prefix;
        }
    } catch (err) {}
    if (!prefix) prefix = '.';

    const grouped = groupCommandsByCategory(client);
    const query = args.join(' ').toLowerCase();

    if (!query) {
        const container = buildMainMenu(client, prefix, grouped);
        const reply = await message.reply({
            components: [container],
            flags: MessageFlags.IsComponentsV2,
            allowedMentions: { repliedUser: false }
        });

        if (!client.helpSessions) client.helpSessions = new Map();
        client.helpSessions.set(reply.id, {
            authorId: message.author.id,
            prefix,
            guildId: message.guildId,
            createdAt: Date.now()
        });

        setTimeout(async () => {
            client.helpSessions?.delete(reply.id);
            try {
                const expiredContainer = buildMainMenu(client, prefix, grouped, true);
                await reply.edit({
                    components: [expiredContainer],
                    flags: MessageFlags.IsComponentsV2,
                    allowedMentions: { parse: [] }
                });
            } catch (e) {}
        }, 3 * 60 * 1000);

        return reply;
    }

    const categoryMatch = Object.keys(grouped).find(cat =>
        cat.toLowerCase() === query ||
        cat.toLowerCase().replace(/\s+/g, '') === query.replace(/\s+/g, '') ||
        cat.toLowerCase().replace(/\s+/g, '_') === query.replace(/\s+/g, '_')
    );

    if (categoryMatch) {
        const container = buildCategoryPage(client, prefix, categoryMatch, grouped[categoryMatch]);
        const reply = await message.reply({
            components: [container],
            flags: MessageFlags.IsComponentsV2,
            allowedMentions: { repliedUser: false }
        });

        if (!client.helpSessions) client.helpSessions = new Map();
        client.helpSessions.set(reply.id, {
            authorId: message.author.id,
            prefix,
            guildId: message.guildId,
            createdAt: Date.now()
        });

        setTimeout(async () => {
            client.helpSessions?.delete(reply.id);
            try {
                const expiredContainer = buildCategoryPage(client, prefix, categoryMatch, grouped[categoryMatch], true);
                await reply.edit({
                    components: [expiredContainer],
                    flags: MessageFlags.IsComponentsV2,
                    allowedMentions: { parse: [] }
                });
            } catch (e) {}
        }, 3 * 60 * 1000);

        return reply;
    }

    const cmd = client.prefixCommands.get(query) ||
                [...client.prefixCommands.values()].find(c => c.aliases?.includes(query));

    if (cmd) {
        const container = buildCommandPage(client, prefix, cmd);
        const reply = await message.reply({
            components: [container],
            flags: MessageFlags.IsComponentsV2,
            allowedMentions: { repliedUser: false }
        });

        if (!client.helpSessions) client.helpSessions = new Map();
        client.helpSessions.set(reply.id, {
            authorId: message.author.id,
            prefix,
            guildId: message.guildId,
            createdAt: Date.now()
        });

        setTimeout(async () => {
            client.helpSessions?.delete(reply.id);
        }, 3 * 60 * 1000);

        return reply;
    }

    const container = new ContainerBuilder();
    container.addTextDisplayComponents(td => td.setContent(`# ${EMOJIS.error || '<a:Emo_Loading:1566551264924405931>'} Not Found`));
    container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small));
    container.addTextDisplayComponents(td => td.setContent(
        `No command or category found matching \`${query}\`.\n\n` +
        `Use \`${prefix}help\` to see all categories.`
    ));

    return message.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
        allowedMentions: { repliedUser: false }
    });
}

const components = [
    {
        customId: 'help_back_main',
        async execute(interaction) {
            const client = interaction.client;
            const session = client.helpSessions?.get(interaction.message.id);

            if (!session) {
                const prefix = client.prefix;
                const grouped = groupCommandsByCategory(client);
                const expiredContainer = buildMainMenu(client, prefix, grouped, true);
                return interaction.update({
                    components: [expiredContainer],
                    flags: MessageFlags.IsComponentsV2
                });
            }

            const prefix = session.prefix || client.prefix;
            const grouped = groupCommandsByCategory(client);
            const container = buildMainMenu(client, prefix, grouped);

            await interaction.update({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });
        }
    },
    {
        customId: 'help_category_select',
        async execute(interaction) {
            const client = interaction.client;
            const session = client.helpSessions?.get(interaction.message.id);

            if (!session) {
                const prefix = client.prefix;
                const grouped = groupCommandsByCategory(client);
                const expiredContainer = buildMainMenu(client, prefix, grouped, true);
                return interaction.update({
                    components: [expiredContainer],
                    flags: MessageFlags.IsComponentsV2
                });
            }

            const prefix = session.prefix || client.prefix;
            const selectedValue = interaction.values[0];
            const grouped = groupCommandsByCategory(client);

            const categoryName = Object.keys(grouped).find(cat =>
                cat.toLowerCase().replace(/\s+/g, '_') === selectedValue
            );

            if (categoryName && grouped[categoryName]) {
                const container = buildCategoryPage(client, prefix, categoryName, grouped[categoryName]);
                await interaction.update({
                    components: [container],
                    flags: MessageFlags.IsComponentsV2
                });
            } else {
                await interaction.reply({
                    content: 'Category not found.',
                    ephemeral: true
                });
            }
        }
    },
    {
        customId: /^help_category_/,
        async execute(interaction) {
            const client = interaction.client;
            const session = client.helpSessions?.get(interaction.message.id);

            if (!session) {
                const prefix = client.prefix;
                const grouped = groupCommandsByCategory(client);
                const expiredContainer = buildMainMenu(client, prefix, grouped, true);
                return interaction.update({
                    components: [expiredContainer],
                    flags: MessageFlags.IsComponentsV2
                });
            }

            const prefix = session.prefix || client.prefix;
            const categoryValue = interaction.customId.replace('help_category_', '');
            const grouped = groupCommandsByCategory(client);

            const categoryName = Object.keys(grouped).find(cat =>
                cat.toLowerCase().replace(/\s+/g, '_') === categoryValue
            );

            if (categoryName && grouped[categoryName]) {
                const container = buildCategoryPage(client, prefix, categoryName, grouped[categoryName]);
                await interaction.update({
                    components: [container],
                    flags: MessageFlags.IsComponentsV2
                });
            } else {
                await interaction.reply({
                    content: 'Category not found.',
                    ephemeral: true
                });
            }
        }
    },
    {
        customId: /^help_page_/,
        async execute(interaction) {
            const client = interaction.client;
            const session = client.helpSessions?.get(interaction.message.id);

            if (!session) {
                const prefix = client.prefix;
                const grouped = groupCommandsByCategory(client);
                const expiredContainer = buildMainMenu(client, prefix, grouped, true);
                return interaction.update({
                    components: [expiredContainer],
                    flags: MessageFlags.IsComponentsV2
                });
            }

            const prefix = session.prefix || client.prefix;

            const parts = interaction.customId.split('_');
            const pageNum = parseInt(parts[parts.length - 1], 10);
            const categoryKey = parts.slice(2, -1).join('_');

            const grouped = groupCommandsByCategory(client);

            const categoryName = Object.keys(grouped).find(cat =>
                cat.toLowerCase().replace(/\s+/g, '_') === categoryKey
            );

            if (categoryName && grouped[categoryName]) {
                const container = buildCategoryPage(client, prefix, categoryName, grouped[categoryName], false, pageNum);
                await interaction.update({
                    components: [container],
                    flags: MessageFlags.IsComponentsV2
                });
            } else {
                await interaction.reply({
                    content: 'Category not found.',
                    ephemeral: true
                });
            }
        }
    }
];

export default { name, aliases, description, usage, execute, category, components };
