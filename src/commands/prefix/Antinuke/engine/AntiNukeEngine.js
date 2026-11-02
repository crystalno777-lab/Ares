import { AuditLogEvent } from 'discord.js';

class AntiNukeEngine {
    constructor(client) {
        this.client = client;
        this.initialized = false;
        this.cache = new Map();
        this.triggers = new Map(); 
    }

    async initialize() {
        if (this.initialized) return;
        this.initialized = true;
        console.log('🛡️ [Antinuke] Engine initialized');
    }

    async getConfig(guildId) {
        if (this.cache.has(guildId)) {
            const cached = this.cache.get(guildId);
            if (Date.now() - cached.timestamp < 30000) {
                return cached.data;
            }
        }

        const guildData = await this.client.db.findOne({ guildId });
        const config = guildData?.antinuke || this.getDefaultConfig();

        this.cache.set(guildId, { data: config, timestamp: Date.now() });
        return config;
    }

    getDefaultConfig() {
        return {
            enabled: false,
            admins: [],
            extraOwners: [],
            whitelist: [],
            modules: {},
            logChannel: null,
            defaultPunishment: 'ban',
            defaultThreshold: 3,
            defaultWindow: 60
        };
    }

    async setConfig(guildId, config) {
        this.cache.set(guildId, { data: config, timestamp: Date.now() });
        await this.client.db.updateOne(
            { guildId },
            { $set: { antinuke: config } },
            { upsert: true }
        );
    }

    invalidateCache(guildId) {
        this.cache.delete(guildId);
    }

    async isEnabled(guildId) {
        const config = await this.getConfig(guildId);
        return config.enabled;
    }

    async isAuthorized(guild, userId) {
        if (!guild) return false;
        if (userId === guild.ownerId) return true;
        if (userId === this.client.user.id) return true;
        if (this.client.config?.owners?.includes(userId)) return true;

        const config = await this.getConfig(guild.id);
        if (config.extraOwners?.includes(userId)) return true;

        return false;
    }

    async isWhitelisted(guild, userId) {
        if (await this.isAuthorized(guild, userId)) return true;
        
        const config = await this.getConfig(guild.id);
        if (config.whitelist?.includes(userId)) return true;

        return false;
    }

    async isModuleEnabled(guildId, moduleId) {
        const config = await this.getConfig(guildId);
        return config.enabled && config.modules?.[moduleId]?.enabled === true;
    }

    async getModuleConfig(guildId, moduleId) {
        const config = await this.getConfig(guildId);
        return config.modules?.[moduleId] || {
            enabled: false,
            threshold: config.defaultThreshold || 3,
            punishment: config.defaultPunishment || 'ban',
            window: config.defaultWindow || 60
        };
    }
    
    async trackAction(guild, userId, moduleId, actionName) {
        if (await this.isWhitelisted(guild, userId)) return;

        const config = await this.getConfig(guild.id);
        const moduleConfig = await this.getModuleConfig(guild.id, moduleId);

        if (!moduleConfig.enabled) return;

        const key = `${guild.id}-${userId}-${moduleId}`;
        const now = Date.now();
        const windowMs = (moduleConfig.window || 60) * 1000;

        let userActions = this.triggers.get(key) || [];
        userActions = userActions.filter(timestamp => now - timestamp < windowMs);
        userActions.push(now);
        
        this.triggers.set(key, userActions);

        if (userActions.length >= moduleConfig.threshold) {
            this.triggers.delete(key);
            await this.punishUser(guild, userId, moduleConfig.punishment, `${moduleConfig.threshold} violations of ${actionName}`);
        }
    }

    async punishUser(guild, userId, punishmentType, reason) {
        try {
            const member = await guild.members.fetch(userId).catch(() => null);
            if (!member) return;

            if (member.id === guild.ownerId || member.id === this.client.user.id) return;

            if (!member.bannable && punishmentType === 'ban') punishmentType = 'kick';
            if (!member.kickable && punishmentType === 'kick') punishmentType = 'strip';

            switch (punishmentType) {
                case 'ban':
                    await member.ban({ reason: `Antinuke: ${reason}` });
                    break;
                case 'kick':
                    await member.kick(`Antinuke: ${reason}`);
                    break;
                case 'timeout':
                    await member.timeout(28 * 24 * 60 * 60 * 1000, `Antinuke: ${reason}`);
                    break;
                case 'strip':
                    await member.roles.set([], `Antinuke: ${reason}`);
                    break;
                case 'protocol':
                    await member.roles.set([], `Antinuke: ${reason}`);
                    await member.timeout(28 * 24 * 60 * 60 * 1000, `Antinuke: ${reason}`);
                    break;
            }

            const config = await this.getConfig(guild.id);
            if (config.logChannel) {
                const logChannel = guild.channels.cache.get(config.logChannel);
                if (logChannel) {
                    logChannel.send(`🚨 **Antinuke Triggered**\n**User:** <@${userId}> (\`${userId}\`)\n**Reason:** ${reason}\n**Punishment:** ${punishmentType}`).catch(() => {});
                }
            }

        } catch (error) {
            console.error(`[Antinuke] Punishment failed for ${userId}:`, error);
        }
    }
}

export default AntiNukeEngine;
