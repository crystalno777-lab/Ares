const { ContainerBuilder, SeparatorSpacingSize, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');

const EMOJIS = {
    antinuke: '<:ansuccess:1537141038647353354>',
    automod: '<:amd:1537927123895984158>',
    automations: '<:strg:1537937596431208538>',
    autoresponder: '<:links:1537211582445256858>',
    customrole: '<:util:1537930563724255382>',
    fun: '<:blitz:1537932133094400040>',
    general: '<:home:1537211540112019456>',
    giveaway: '<:waring:1537927657000538273>',
    leaderboard: '<:dev:1537211621745885225>',
    logging: '<:logs:1537929458135334922>',
    moderation: '<:modaration:1537930249604567091>',
    music: '<:ping:1538948474060415016>',
    permit: '<:unban:1537060828992512020>',
    reactionroles: '<:kick:1537058429980508221>',
    ticket: '<:links:1537211582445256858>',
    utility: '<:util:1537930563724255382>',
    vanityroles: '<:blitz:1537932133094400040>',
    voice: '<:ping:1538948474060415016>'
};

const EMOJI_IDS = {
    antinuke: '1537141038647353354',
    automod: '1537927123895984158',
    automations: '1537937596431208538',
    autoresponder: '1537211582445256858',
    customrole: '1537930563724255382',
    fun: '1537932133094400040',
    general: '1537211540112019456',
    giveaway: '1537927657000538273',
    leaderboard: '1537211621745885225',
    logging: '1537929458135334922',
    moderation: '1537930249604567091',
    music: '1538948474060415016',
    permit: '1537060828992512020',
    reactionroles: '1537058429980508221',
    ticket: '1537211582445256858',
    utility: '1537930563724255382',
    vanityroles: '1537932133094400040',
    voice: '1538948474060415016'
};

const categories = [
    { 
        label: 'Antinuke', value: 'antinuke', desc: 'Get All Antinuke Commands',
        sections: [
            { name: 'Antinuke', cmds: ['security', 'antinuke limit', 'antinuke punishment', 'antinuke config', 'antinuke reset', 'whitelist add', 'whitelist remove', 'whitelist show', 'whitelist reset'] },
            { name: 'MainRole', cmds: ['mainrole add', 'mainrole remove', 'mainrole list', 'mainrole reset'] }
        ]
    },
    { 
        label: 'AutoMod', value: 'automod', desc: 'Get All Automod Commands',
        sections: [
            { name: 'AutoMod', cmds: ['automod enable', 'automod disable', 'automod config', 'automod set'] }
        ]
    },
    { 
        label: 'Automations', value: 'automations', desc: 'Get All Automations Commands',
        sections: [
            { name: 'Automations', cmds: ['automation create', 'automation delete', 'automation list'] }
        ]
    },
    { 
        label: 'Autoresponder', value: 'autoresponder', desc: 'Get All Autoresponder Commands',
        sections: [
            { name: 'Autoresponder', cmds: ['autoresponder create', 'autoresponder delete', 'autoresponder list'] }
        ]
    },
    { 
        label: 'CustomRole', value: 'customrole', desc: 'Get All CustomRole Commands',
        sections: [
            { name: 'CustomRole', cmds: ['customrole create', 'customrole delete', 'customrole list'] }
        ]
    },
    { 
        label: 'Fun', value: 'fun', desc: 'Get All Fun Commands',
        sections: [
            { name: 'Fun', cmds: ['8ball', 'meme', 'trivia', 'roll', 'coinflip'] }
        ]
    },
    { 
        label: 'General', value: 'general', desc: 'Get All General Commands',
        sections: [
            { name: 'General', cmds: ['help', 'ping', 'stats', 'invite', 'uptime'] }
        ]
    },
    { 
        label: 'Giveaway', value: 'giveaway', desc: 'Get all giveaway commands',
        sections: [
            { name: 'Giveaway', cmds: ['gstart', 'gend', 'greroll', 'glist'] }
        ]
    },
    { 
        label: 'Leaderboard', value: 'leaderboard', desc: 'Get All Leaderboard Commands',
        sections: [
            { name: 'Leaderboard', cmds: ['leaderboard', 'rank', 'levels'] }
        ]
    },
    { 
        label: 'Logging', value: 'logging', desc: 'Get All Logging Commands',
        sections: [
            { name: 'Logging', cmds: ['logs setup', 'logs disable', 'logs config'] }
        ]
    },
    { 
        label: 'Moderation', value: 'moderation', desc: 'Get All Moderation Commands',
        sections: [
            { name: 'Moderation', cmds: ['ban', 'kick', 'mute', 'warn', 'purge'] }
        ]
    },
    { 
        label: 'Music', value: 'music', desc: 'Get All Music Commands',
        sections: [
            { name: 'Music', cmds: ['play', 'pause', 'skip', 'stop', 'queue'] }
        ]
    },
    { 
        label: 'Permit', value: 'permit', desc: 'Get All Permit Commands',
        sections: [
            { name: 'Permit', cmds: ['permit add', 'permit remove', 'permit list'] }
        ]
    },
    { 
        label: 'ReactionRoles', value: 'reactionroles', desc: 'Get All ReactionRoles Commands',
        sections: [
            { name: 'ReactionRoles', cmds: ['rr add', 'rr remove', 'rr list'] }
        ]
    },
    { 
        label: 'Ticket', value: 'ticket', desc: 'Get All Ticket Commands',
        sections: [
            { name: 'Ticket', cmds: ['ticket setup', 'ticket close', 'ticket add'] }
        ]
    },
    { 
        label: 'Utility', value: 'utility', desc: 'Get All Utility Commands',
        sections: [
            { name: 'Utility', cmds: ['avatar', 'banner', 'userinfo', 'serverinfo'] }
        ]
    },
    { 
        label: 'Vanityroles', value: 'vanityroles', desc: 'Get All Vanityroles Commands',
        sections: [
            { name: 'Vanityroles', cmds: ['vanityrole add', 'vanityrole remove'] }
        ]
    },
    { 
        label: 'Voice', value: 'voice', desc: 'Get All Voice Commands',
        sections: [
            { name: 'Voice', cmds: ['join', 'leave', 'voicekick', 'voicemute'] }
        ]
    }
];

module.exports = {
    name: 'help',
    slashData: { name: 'help', description: 'Show the interactive help menu' },

    async executeSlash(interaction, workers, memoryDB) {
        const container = buildMainContainer(interaction.client);
        const row = buildSelectMenu();
        await interaction.editReply({ components: [container, row], flags: MessageFlags.IsComponentsV2 });
    },

    async executePrefix(msg, args, workers, memoryDB) {
        const container = buildMainContainer(msg.client);
        const row = buildSelectMenu();
        await msg.reply({ components: [container, row], flags: MessageFlags.IsComponentsV2 });
    },

    async handleSelectMenu(interaction) {
        const selectedValue = interaction.values[0];
        const category = categories.find(c => c.value === selectedValue);

        if (!category) return;

        const container = buildCommandContainer(category, interaction.user, 0);
        await interaction.update({ components: [container] });
    },

    async handleButton(interaction) {
        if (interaction.customId.startsWith('help_page_')) {
            const parts = interaction.customId.split('_');
            const action = parts[2];
            const categoryValue = parts[3];
            let page = parseInt(parts[4]);

            const category = categories.find(c => c.value === categoryValue);
            if (!category) return;

            if (action === 'next') page++;
            if (action === 'prev') page--;
            if (action === 'first') page = 0;
            if (action === 'last') page = Math.ceil(category.sections.length / 2) - 1;
            if (action === 'del') return interaction.message.delete().catch(() => {});
            if (action === 'back') {
                const container = buildMainContainer(interaction.client);
                const row = buildSelectMenu();
                return interaction.update({ components: [container, row], flags: MessageFlags.IsComponentsV2 });
            }

            const container = buildCommandContainer(category, interaction.user, page);
            await interaction.update({ components: [container] });
        }
    }
};

function buildMainContainer(client) {
    const container = new ContainerBuilder();

    container.addSectionComponents(sec =>
        sec.addTextDisplayComponents(td =>
            td.setContent(`# Hey , I'm Questzy™\n` +
                `A powerful multipurpose bot with Fastest Antinuke\n\n` +
                `• **My Prefix is** \`!\`\n` +
                `• **Total Commands:** \`${client.commands?.size || 528}\`\n` +
                `• **Choose a Specific Module of your Desire**`)
        ).setThumbnailAccessory(thumb => thumb.setURL(client.user.displayAvatarURL()))
    );

    container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small));

    const listString = categories.map(c => `${EMOJIS[c.value]} » **${c.label}**`).join('\n');
    
    container.addTextDisplayComponents(td => 
        td.setContent(listString)
    );

    container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small));
    
    container.addTextDisplayComponents(td =>
        td.setContent(`*Select a category from the dropdown below*`)
    );

    return container;
}

function buildCommandContainer(category, user, page = 0) {
    const container = new ContainerBuilder();
    
    container.addSectionComponents(sec =>
        sec.addTextDisplayComponents(td =>
            td.setContent(`# ${EMOJIS[category.value]} ${category.label}\n`)
        ).setThumbnailAccessory(thumb => thumb.setURL(user.displayAvatarURL()))
    );

    container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small));

    const sectionsPerPage = 2;
    const totalPages = Math.ceil(category.sections.length / sectionsPerPage);
    const startIndex = page * sectionsPerPage;
    const pageSections = category.sections.slice(startIndex, startIndex + sectionsPerPage);

    for (const section of pageSections) {
        const cmdString = section.cmds.map(c => `\`${c}\``).join(', ');
        container.addTextDisplayComponents(td =>
            td.setContent(`__**${section.name}**__\n${cmdString}`)
        );
    }

    container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small));

    container.addTextDisplayComponents(td =>
        td.setContent(`Requested by ${user.username} | Page ${page + 1} / ${totalPages || 1}`)
    );

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`help_page_first_${category.value}_${page}`).setEmoji('⏪').setStyle(ButtonStyle.Secondary).setDisabled(page === 0),
        new ButtonBuilder().setCustomId(`help_page_prev_${category.value}_${page}`).setEmoji('◀️').setStyle(ButtonStyle.Secondary).setDisabled(page === 0),
        new ButtonBuilder().setCustomId(`help_page_del_${category.value}_${page}`).setEmoji('🗑️').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`help_page_next_${category.value}_${page}`).setEmoji('▶️').setStyle(ButtonStyle.Secondary).setDisabled(page >= totalPages - 1),
        new ButtonBuilder().setCustomId(`help_page_last_${category.value}_${page}`).setEmoji('⏩').setStyle(ButtonStyle.Secondary).setDisabled(page >= totalPages - 1)
    );

    container.addActionRowComponents(row);
    return container;
}

function buildSelectMenu() {
    const select = new StringSelectMenuBuilder()
        .setCustomId('help_menu_select')
        .setPlaceholder('> Select Module From Here');

    const options = categories.map(c => 
        new StringSelectMenuOptionBuilder()
            .setLabel(c.label)
            .setDescription(c.desc)
            .setValue(c.value)
            .setEmoji(EMOJI_IDS[c.value])
    );

    select.addOptions(options);
    return new ActionRowBuilder().addComponents(select);
}
