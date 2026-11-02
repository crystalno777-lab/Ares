import { Client, Collection, GatewayIntentBits, Partials, Events } from 'discord.js';
import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';

import { bootstrap } from './src/utils/bootstrap.js';

loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.AutoModerationExecution,
		GatewayIntentBits.GuildPresences
	],
	partials: [
		Partials.Channel,
		Partials.GuildMember,
		Partials.Message,
		Partials.Reaction,
		Partials.User,
		Partials.GuildScheduledEvent
	]
});

client.commands = new Collection();
client.prefixCommands = new Collection();
client.prefixAliases = new Collection();
client.components = new Collection();
client.componentContexts = new Map();

client.updateConfig = async (newConfig) => {
	const CONFIG_PATH = path.join(__dirname, 'config.json');
	try {
		await writeFile(CONFIG_PATH, JSON.stringify(newConfig, null, 2), 'utf8');
		client.config = newConfig;
	} catch (error) {
		console.error('Error updating config:', error);
		throw error;
	}
};

// --- INTERACTION CREATE EVENT ---
client.on(Events.InteractionCreate, async (interaction) => {
	try {
		// 1. Help Menu Pagination Buttons
		if (interaction.isButton() && interaction.customId.startsWith('help_page_')) {
			const helpCmd = client.commands.get('help') || client.prefixCommands.get('help');
			if (helpCmd && helpCmd.handleButton) {
				return await helpCmd.handleButton(interaction);
			}
		}

		// 2. Help Select Menu
		if (interaction.isStringSelectMenu() && interaction.customId === 'help_menu_select') {
			const helpCmd = client.commands.get('help') || client.prefixCommands.get('help');
			if (helpCmd && helpCmd.handleSelectMenu) {
				return await helpCmd.handleSelectMenu(interaction);
			}
		}

		// 3. Antinuke Buttons
		if (interaction.isButton() && interaction.customId.startsWith('antinuke_')) {
			const anCmd = client.commands.get('antinuke') || client.prefixCommands.get('antinuke');
			if (anCmd && anCmd.handleButton) {
				return await anCmd.handleButton(interaction);
			}
		}

		// 4. Antinuke Select Menus
		if (interaction.isStringSelectMenu() && interaction.customId.startsWith('antinuke_')) {
			const anCmd = client.commands.get('antinuke') || client.prefixCommands.get('antinuke');
			if (anCmd && anCmd.handleSelectMenu) {
				return await anCmd.handleSelectMenu(interaction);
			}
		}

		// 5. Slash Commands
		if (interaction.isChatInputCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return;

			if (command.executeSlash) {
				await command.executeSlash(interaction, client.workers || new Map(), client.memoryDB || new Map());
			} else if (command.execute) {
				await command.execute(interaction, client);
			}
		}

		// 6. Modal Submits
		if (interaction.isModalSubmit()) {
			// Hypersquad Modals
			if (interaction.customId === 'hypesquad_modal' || interaction.customId.startsWith('hs_modal_')) {
				const hsCmd = client.commands.get('hypesquad') || client.prefixCommands.get('hypesquad') || client.commands.get('help');
				if (hsCmd && hsCmd.handleModalSubmit) {
					return await hsCmd.handleModalSubmit(interaction);
				}
			}
		}

		// 7. Custom Components (Dropdowns/Buttons mapped in bootstrap)
		if (interaction.isButton() || interaction.isStringSelectMenu()) {
			const component = client.components.get(interaction.customId);
			if (component && component.execute) {
				return await component.execute(interaction, client);
			}
		}
		
	} catch (error) {
		console.error('Interaction Error:', error);
		if (!interaction.replied && !interaction.deferred) {
			await interaction.reply({ content: '❌ An error occurred while processing this interaction.', ephemeral: true }).catch(() => {});
		}
	}
});

// --- MESSAGE CREATE EVENT (Prefix Commands) ---
client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot || !message.guild) return;

	const prefix = client.config?.prefix || '!';
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	// Find command or alias
	const command = client.prefixCommands.get(commandName) || client.prefixCommands.get(client.prefixAliases.get(commandName));

	if (!command) return;

	try {
		if (command.execute) {
			await command.execute(message, args, client);
		} else if (command.executePrefix) {
			await command.executePrefix(message, args, client.workers || new Map(), client.memoryDB || new Map());
		}
	} catch (error) {
		console.error(`Prefix Command Error (${commandName}):`, error);
		message.reply('❌ An error occurred while executing this command.').catch(() => {});
	}
});

process.on('uncaughtException', (error) => {
	console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason) => {
	console.error('Unhandled promise rejection:', reason);
});

process.on('warning', (warning) => {
	if (warning.name === 'DeprecationWarning' && warning.message.includes('The ready event has been renamed to clientReady')) {
		return;
	}
	console.warn(warning);
});

bootstrap(client, __dirname).catch((error) => {
	console.error('Failed to start Ares:', error);
	process.exit(1);
});
