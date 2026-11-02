import { ContainerBuilder, SeparatorSpacingSize, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } from 'discord.js';

const MODULES = {
    ban: { name: 'Anti Ban', description: 'Prevents mass banning of members' },
    kick: { name: 'Anti Kick', description: 'Prevents mass kicking of members' },
    role: { name: 'Anti Role', description: 'Prevents mass deletion/creation of roles' },
    channel: { name: 'Anti Channel', description: 'Prevents mass deletion/creation of channels' },
    webhook: { name: 'Anti Webhook', description: 'Prevents mass creation of webhooks' },
    emoji: { name: 'Anti Emoji', description: 'Prevents mass deletion of emojis' },
    botadd: { name: 'Anti Bot', description: 'Prevents unauthorized bot additions' },
    vanity: { name: 'Anti Vanity', description: 'Prevents vanity URL changes' },
    prune: { name: 'Anti Prune', description: 'Prevents mass member pruning' },
    permissions: { name: 'Anti Permissions', description: 'Monitors dangerous permission grants' }
};

const PUNISHMENTS = {
    protocol: { name: 'Protocol', description: 'Removes all roles and applies timeout' },
    strip: { name: 'Strip Roles', description: 'Removes all dangerous roles' },
    kick: { name: 'Kick', description: 'Kicks the user from server' },
    ban: { name: 'Ban', description: 'Permanently bans the user' },
    timeout: { name: 'Timeout', description: 'Times out for 28 days' }
};

const PRESETS = {
    recommended: {
        name: 'Recommended',
        description: 'Balanced protection for most servers',
        threshold: 3,
        window: 60,
        punishment: 'ban',
        modules: ['ban', 'kick', 'role', 'channel', 'webhook', 'botadd']
    },
    strict: {
        name: 'Strict',
        description: 'Maximum protection for high-risk servers',
        threshold: 2,
        window: 60,
        punishment: 'ban',
        modules: ['ban', 'kick', 'role', 'channel', 'webhook', 'emoji', 'botadd', 'vanity', 'prune', 'permissions']
    },
    light: {
        name: 'Light',
        description: 'Basic protection with higher tolerance',
        threshold: 5,
        window: 60,
        punishment: 'kick',
        modules: ['ban', 'kick', 'channel']
    }
};

const cleanId = (raw) => (typeof raw === 'string' ? raw.replace(/[<@!>]/g, '').trim() : null);

const fetchUserOrMember = async (client, guild, raw) => {
    const id = cleanId(raw);
    if (!id) return null;

    const member = await guild.members.fetch(id).catch(() => null);
    if (member) return { user: member.user, member };

    const user = await client.users.fetch(id).catch(() => null);
    if (user) return { user, member: guild.members.cache.get(user.id) || null };

    return null;
};

const buildWizardContainer = (guildData, viewMode = null, disabled = false) => {
    const container = new ContainerBuilder();

    const status = guildData.antinuke?.enabled;
    const enabledModules = Object.entries(guildData.antinuke?.modules || {})
        .filter(([_, m]) => m.enabled).length;
    const totalModules = Object.keys(MODULES).length;

    container.addTextDisplayComponents(td =>
        td.setContent(`# Antinuke Setup Wizard${disabled ? ' (Expired)' : ''}\n` +
            `${disabled ? '**This wizard has expired. Run the command again to create a new one.**\n\n' : ''}` +
            `Configure your server's protection system with ease.\n\n` +
            `**Current Status:** ${status ? 'Enabled' : 'Disabled'}\n` +
            `**Active Modules:** ${enabledModules}/${totalModules}\n` +
            `**Punishment:** ${guildData.antinuke?.defaultPunishment || 'ban'}\n` +
            `**Threshold:** ${guildData.antinuke?.defaultThreshold || 3} actions`)
    );

    container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small));

    container.addTextDisplayComponents(td =>
        td.setContent(`### Quick Setup Presets\nChoose a preset to quickly configure protection:`)
    );

    const presetRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('antinuke_preset_recommended')
            .setLabel('Recommended')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disabled),
        new ButtonBuilder()
            .setCustomId('antinuke_preset_strict')
            .setLabel('Strict')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(disabled),
        new ButtonBuilder()
            .setCustomId('antinuke_preset_light')
            .setLabel('Light')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(disabled)
    );

    container.addActionRowComponents(presetRow);

    container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small));

    container.addTextDisplayComponents(td =>
        td.setContent(`### Manual Configuration`)
    );

    const configRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('antinuke_modules')
            .setLabel('Modules')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(disabled),
        new ButtonBuilder()
            .setCustomId('antinuke_punishment_menu')
            .setLabel('Punishment')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(disabled),
        new ButtonBuilder()
            .setCustomId('antinuke_thresholds')
            .setLabel('Thresholds')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(disabled),
        new ButtonBuilder()
            .setCustomId('antinuke_whitelist_view')
            .setLabel('Whitelist')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(disabled),
        new ButtonBuilder()
            .setCustomId('antinuke_admins_view')
            .setLabel('Admins')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(disabled)
    );

    container.addActionRowComponents(configRow);

    const toggleRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`antinuke_toggle_${status ? 'off' : 'on'}`)
            .setLabel(status ? 'Disable Antinuke' : 'Enable Antinuke')
            .setStyle(status ? ButtonStyle.Danger : ButtonStyle.Success)
            .setDisabled(disabled),
        new ButtonBuilder()
            .setCustomId('antinuke_view_config')
            .setLabel('View Full Config')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(disabled)
    );

    container.addActionRowComponents(toggleRow);

    return container;
};

export default {
    name: 'antinuke',
    aliases: ['antiwizard'],
    description: 'Advanced server protection system',
    usage: '.antinuke [subcommand]',
    category: 'Antinuke',

    async execute(message, args, client) {
        const guildData = await this.getGuildData(client, message.guildId);

        const isOwner = message.guild.ownerId === message.author.id;
        const isExtraOwner = Array.isArray(guildData.antinuke?.extraOwners) && guildData.antinuke.extraOwners.includes(message.author.id);

        if (!isOwner && !isExtraOwner) {
            return this.sendError(
                message,
                'Permission Denied',
                'Only the **Server Owner** or configured **Extra Owners** can use antinuke commands.'
            );
        }

        const subcommand = args[0]?.toLowerCase();

        if (!subcommand || subcommand === 'help') {
            return this.showHelp(message, guildData);
        }

        const ownerOnlyCommands = ['extraowner', 'extraowners', 'reset'];
        if (ownerOnlyCommands.includes(subcommand) && !isOwner) {
            return this.sendError(message, 'Owner Only', 'Only the server owner can use this command.');
        }

        switch (subcommand) {
            case 'wizard':
            case 'setup':
                return this.showSetupWizard(message, client, guildData);
            case 'on':
            case 'enable':
                return this.handleEnable(message, client, guildData);
            case 'off':
            case 'disable':
                return this.handleDisable(message, client, guildData);
            case 'preset':
                return this.handlePreset(message, args, client, guildData);
            case 'extraowner':
                return this.handleExtraOwner(message, args, client, guildData);
            case 'extraowners':
                return this.handleExtraOwnersList(message, guildData);
            case 'whitelist':
            case 'wl':
                return this.handleWhitelist(message, args, client, guildData);
            case 'logs':
            case 'logchannel':
                return this.handleLogChannel(message, args, client, guildData);
            case 'punishment':
            case 'punish':
                return this.handlePunishment(message, args, client, guildData);
            case 'threshold':
            case 'limit':
                return this.handleThreshold(message, args, client, guildData);
            case 'reset':
                return this.handleReset(message, client, guildData);
            default:
                if (MODULES[subcommand]) {
                    return this.handleModule(message, args, client, guildData, subcommand);
                }
                return this.showHelp(message, guildData);
        }
    },

    async handleButton(interaction) {
        const { customId } = interaction;
        
        if (!customId.startsWith('antinuke_')) return;

        const guildData = await this.getGuildData(interaction.client, interaction.guildId);
        
        const isOwner = interaction.guild.ownerId === interaction.user.id;
        const isExtraOwner = Array.isArray(guildData.antinuke?.extraOwners) && guildData.antinuke.extraOwners.includes(interaction.user.id);
        
        if (!isOwner && !isExtraOwner) {
            return interaction.reply({ content: 'Only the Server Owner or Extra Owners can use this.', ephemeral: true });
        }

        if (customId === 'antinuke_whitelist_view') {
            const container = new ContainerBuilder();
            container.addTextDisplayComponents(td => td.setContent(`# Whitelist Configuration for Current Server`));
            container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small));

            const modules = guildData.antinuke?.modules || {};
            const formatIcon = (enabled) => enabled ? 'Enabled' : 'Disabled';

            container.addTextDisplayComponents(td => 
                td.setContent(
                    `${formatIcon(modules.ban?.enabled)} : Anti Ban\n` +
                    `${formatIcon(modules.kick?.enabled)} : Anti Kick\n` +
                    `${formatIcon(modules.role?.enabled)} : Anti Role\n` +
                    `${formatIcon(modules.channel?.enabled)} : Anti Channel\n` +
                    `${formatIcon(modules.webhook?.enabled)} : Anti Webhook\n` +
                    `${formatIcon(modules.botadd?.enabled)} : Anti Bot`
                )
            );

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('antinuke_setup').setLabel('Back to Setup').setStyle(ButtonStyle.Secondary)
            );
            container.addActionRowComponents(row);

            return interaction.update({ components: [container], flags: MessageFlags.IsComponentsV2 });
        }

        if (customId === 'antinuke_setup') {
            const container = buildWizardContainer(guildData);
            return interaction.update({ components: [container], flags: MessageFlags.IsComponentsV2 });
        }

        if (customId === 'antinuke_toggle_on' || customId === 'antinuke_toggle_off') {
            guildData.antinuke.enabled = customId === 'antinuke_toggle_on';
            await this.saveGuildData(interaction.client, interaction.guildId, guildData.antinuke);
            const container = buildWizardContainer(guildData);
            return interaction.update({ components: [container], flags: MessageFlags.IsComponentsV2 });
        }

        if (customId.startsWith('antinuke_preset_')) {
            const presetName = customId.replace('antinuke_preset_', '');
            if (!PRESETS[presetName]) return;

            const preset = PRESETS[presetName];
            guildData.antinuke.enabled = true;
            guildData.antinuke.defaultThreshold = preset.threshold;
            guildData.antinuke.defaultWindow = preset.window;
            guildData.antinuke.defaultPunishment = preset.punishment;
            guildData.antinuke.modules = {};

            for (const mod of preset.modules) {
                guildData.antinuke.modules[mod] = {
                    enabled: true,
                    threshold: preset.threshold,
                    window: preset.window,
                    punishment: preset.punishment
                };
            }

            await this.saveGuildData(interaction.client, interaction.guildId, guildData.antinuke);
            const container = buildWizardContainer(guildData);
            return interaction.update({ components: [container], flags: MessageFlags.IsComponentsV2 });
        }
    },

    async getGuildData(client, guildId) {
        const data = await client.db.findOne({ guildId }) || { guildId };
        if (!data.antinuke) {
            data.antinuke = {
                enabled: false,
                admins: [],
                extraOwners: [],
                whitelist: [],
                modules: {},
                logChannel: null,
                defaultPunishment: 'ban',
                defaultThreshold: 3,
                defaultWindow: 60,
            };
        }
        return data;
    },

    async saveGuildData(client, guildId, antinuke) {
        await client.db.updateOne(
            { guildId },
            { $set: { antinuke } },
            { upsert: true }
        );
    },

    async showSetupWizard(message, client, guildData) {
        const container = buildWizardContainer(guildData);
        return message.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
    },

    async handleEnable(message, client, guildData) {
        guildData.antinuke.enabled = true;
        await this.saveGuildData(client, message.guildId, guildData.antinuke);
        return this.sendSuccess(message, 'Antinuke Enabled', 'Server protection is now active.');
    },

    async handleDisable(message, client, guildData) {
        guildData.antinuke.enabled = false;
        await this.saveGuildData(client, message.guildId, guildData.antinuke);
        return this.sendSuccess(message, 'Antinuke Disabled', 'Server protection is now disabled.');
    },

    async handlePreset(message, args, client, guildData) {
        const presetName = args[1]?.toLowerCase();
        if (!presetName || !PRESETS[presetName]) {
            return this.sendInfo(message, 'Setup Presets', 'Available: recommended, strict, light');
        }
        const preset = PRESETS[presetName];
        guildData.antinuke.enabled = true;
        guildData.antinuke.defaultThreshold = preset.threshold;
        guildData.antinuke.defaultWindow = preset.window;
        guildData.antinuke.defaultPunishment = preset.punishment;
        guildData.antinuke.modules = {};
        for (const mod of preset.modules) {
            guildData.antinuke.modules[mod] = { enabled: true, threshold: preset.threshold, window: preset.window, punishment: preset.punishment };
        }
        await this.saveGuildData(client, message.guildId, guildData.antinuke);
        return this.sendSuccess(message, `${preset.name} Preset Applied`, 'Antinuke is now enabled with the preset.');
    },

    async handleExtraOwner(message, args, client, guildData) {
        const rawTarget = ['add', 'remove'].includes(args[1]?.toLowerCase()) ? args[2] : args[1];
        const target = (message.mentions.users.first() || (await fetchUserOrMember(client, message.guild, rawTarget))?.user);
        if (!target) return this.sendError(message, 'Invalid Usage', 'Usage: `.antinuke extraowner @user`');
        if (target.id === message.guild.ownerId) return this.sendError(message, 'Invalid Target', 'Owner cannot be extra owner.');
        if (!guildData.antinuke.extraOwners) guildData.antinuke.extraOwners = [];
        const index = guildData.antinuke.extraOwners.indexOf(target.id);
        let action;
        if (index === -1) { guildData.antinuke.extraOwners.push(target.id); action = 'added as'; }
        else { guildData.antinuke.extraOwners.splice(index, 1); action = 'removed from'; }
        await this.saveGuildData(client, message.guildId, guildData.antinuke);
        return this.sendSuccess(message, 'Extra Owner Updated', `**${target.username}** has been ${action} extra owner.`);
    },

    async handleExtraOwnersList(message, guildData) {
        const owners = guildData.antinuke?.extraOwners || [];
        if (owners.length === 0) return this.sendInfo(message, 'Extra Owners', 'No extra owners configured.');
        const ownerList = owners.map((id, i) => `\`${i + 1}\` <@${id}>`).join('\n');
        return this.sendInfo(message, `Extra Owners (${owners.length})`, ownerList);
    },

    async handleWhitelist(message, args, client, guildData) {
        const action = args[1]?.toLowerCase();
        
        if (!action) {
            const container = new ContainerBuilder();
            container.addTextDisplayComponents(td => td.setContent(`# Whitelist Configuration for Current Server`));
            container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small));
            const modules = guildData.antinuke?.modules || {};
            const formatIcon = (enabled) => enabled ? 'Enabled' : 'Disabled';
            container.addTextDisplayComponents(td => 
                td.setContent(
                    `${formatIcon(modules.ban?.enabled)} : Anti Ban\n` +
                    `${formatIcon(modules.kick?.enabled)} : Anti Kick\n` +
                    `${formatIcon(modules.role?.enabled)} : Anti Role\n` +
                    `${formatIcon(modules.channel?.enabled)} : Anti Channel\n` +
                    `${formatIcon(modules.webhook?.enabled)} : Anti Webhook\n` +
                    `${formatIcon(modules.botadd?.enabled)} : Anti Bot`
                )
            );
            return message.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
        }

        const targetArg = ['add', 'remove'].includes(action) ? args[2] : args[1];
        const target = (message.mentions.users.first() || (await fetchUserOrMember(client, message.guild, targetArg))?.user);
        if (!target) return this.sendError(message, 'Invalid Usage', 'Usage: `.antinuke whitelist add @user`');
        if (!guildData.antinuke.whitelist) guildData.antinuke.whitelist = [];
        if (action === 'add') {
            if (guildData.antinuke.whitelist.includes(target.id)) return this.sendError(message, 'Error', 'Already whitelisted.');
            guildData.antinuke.whitelist.push(target.id);
        } else {
            const index = guildData.antinuke.whitelist.indexOf(target.id);
            if (index === -1) return this.sendError(message, 'Error', 'Not whitelisted.');
            guildData.antinuke.whitelist.splice(index, 1);
        }
        await this.saveGuildData(client, message.guildId, guildData.antinuke);
        return this.sendSuccess(message, 'Whitelist Updated', `**${target.username}** has been ${action === 'add' ? 'added to' : 'removed from'} the whitelist.`);
    },

    async handleLogChannel(message, args, client, guildData) {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
        if (!channel && args[1]?.toLowerCase() !== 'off') {
            return this.sendInfo(message, 'Log Channel', `Current: ${guildData.antinuke?.logChannel ? `<#${guildData.antinuke.logChannel}>` : 'Not set'}`);
        }
        guildData.antinuke.logChannel = args[1]?.toLowerCase() === 'off' ? null : channel.id;
        await this.saveGuildData(client, message.guildId, guildData.antinuke);
        return this.sendSuccess(message, 'Log Channel Updated', 'Log channel configuration updated.');
    },

    async handlePunishment(message, args, client, guildData) {
        const punishment = args[1]?.toLowerCase();
        if (!punishment || !PUNISHMENTS[punishment]) {
            return this.sendError(message, 'Invalid Punishment', `Valid: ${Object.keys(PUNISHMENTS).join(', ')}`);
        }
        guildData.antinuke.defaultPunishment = punishment;
        await this.saveGuildData(client, message.guildId, guildData.antinuke);
        return this.sendSuccess(message, 'Default Punishment Updated', `Now set to **${punishment}**.`);
    },

    async handleThreshold(message, args, client, guildData) {
        const threshold = parseInt(args[1]);
        if (!threshold || threshold < 1 || threshold > 20) return this.sendError(message, 'Invalid Threshold', 'Usage: `.antinuke threshold <1-20>`');
        guildData.antinuke.defaultThreshold = threshold;
        await this.saveGuildData(client, message.guildId, guildData.antinuke);
        return this.sendSuccess(message, 'Default Threshold Updated', `Now set to **${threshold}**.`);
    },

    async handleModule(message, args, client, guildData, moduleName) {
        const action = args[1]?.toLowerCase();
        const moduleInfo = MODULES[moduleName];
        if (!action) {
            const config = guildData.antinuke?.modules?.[moduleName];
            let content = `**Module:** ${moduleInfo.name}\n`;
            content += `**Description:** ${moduleInfo.description}\n`;
            content += `**Status:** ${config?.enabled ? `Enabled` : `Disabled`}\n`;
            if (config?.enabled) content += `**Threshold:** ${config.threshold} | **Punishment:** ${config.punishment}`;
            return this.sendInfo(message, `${moduleInfo.name} Module`, content);
        }
        if (action === 'on' || action === 'enable') {
            if (!guildData.antinuke.modules) guildData.antinuke.modules = {};
            guildData.antinuke.modules[moduleName] = { enabled: true, threshold: guildData.antinuke?.defaultThreshold || 3, punishment: guildData.antinuke?.defaultPunishment || 'ban', window: guildData.antinuke?.defaultWindow || 60 };
            await this.saveGuildData(client, message.guildId, guildData.antinuke);
            return this.sendSuccess(message, 'Module Enabled', `**${moduleInfo.name}** is now enabled.`);
        }
        if (action === 'off' || action === 'disable') {
            if (guildData.antinuke.modules?.[moduleName]) {
                guildData.antinuke.modules[moduleName].enabled = false;
                await this.saveGuildData(client, message.guildId, guildData.antinuke);
            }
            return this.sendSuccess(message, 'Module Disabled', `**${moduleInfo.name}** has been disabled.`);
        }
    },

    async handleReset(message, client, guildData) {
        guildData.antinuke = {
            enabled: false, admins: [], extraOwners: [], whitelist: [], modules: {}, logChannel: null, defaultPunishment: 'ban', defaultThreshold: 3, defaultWindow: 60,
        };
        await this.saveGuildData(client, message.guildId, guildData.antinuke);
        return this.sendSuccess(message, 'Antinuke Reset', 'All settings reset.');
    },

    showHelp(message, guildData) {
        const status = guildData.antinuke?.enabled;
        let content = `**Status:** ${status ? 'Active' : 'Inactive'}\n\n`;
        content += `**Core Commands:**\n`;
        content += `\`.antinuke wizard\` - Interactive setup\n`;
        content += `\`.antinuke on/off\` - Toggle protection\n`;
        content += `\`.antinuke whitelist @user\` - Toggle whitelist\n`;
        content += `\`.antinuke extraowner @user\` - Toggle extra owner\n`;
        return this.sendInfo(message, 'Antinuke Help', content);
    },

    sendError(message, title, description) {
        const container = new ContainerBuilder();
        container.addTextDisplayComponents(td => td.setContent(`# ${title}`));
        container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small));
        container.addTextDisplayComponents(td => td.setContent(description));
        return message.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
    },

    sendSuccess(message, title, description) {
        const container = new ContainerBuilder();
        container.addTextDisplayComponents(td => td.setContent(`# ${title}`));
        container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small));
        container.addTextDisplayComponents(td => td.setContent(description));
        return message.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
    },

    sendInfo(message, title, description) {
        const container = new ContainerBuilder();
        container.addTextDisplayComponents(td => td.setContent(`# ${title}`));
        container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Small));
        container.addTextDisplayComponents(td => td.setContent(description));
        return message.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
    }
};

export { buildWizardContainer, MODULES, PRESETS };
