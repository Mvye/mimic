import { config } from 'dotenv';
import { Client, GatewayIntentBits, REST, Routes, ChatInputCommandInteraction, Interaction } from 'discord.js';

config();

// Explicitly declare these as strings and provide default values or handle undefined cases
const TOKEN: string = process.env.MIMIC_BOT_TOKEN ?? '';
const CLIENT_ID: string = process.env.MIMIC_BOT_CLIENT_ID ?? '';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    // Check if client.user is not null before logging
    if (client.user) {
        console.log(`Logged in as ${client.user.tag}!`);
    } else {
        console.log('Client logged in, but user details are not available.');
    }
});

client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction as ChatInputCommandInteraction;

    if (command.commandName === 'mimic') {
        await command.reply("HI! I'm Mimic Bot");
    }

    if (command.commandName === 'howoldami') {
        const user = command.user;
        const age = Date.now() - user.createdTimestamp;
        const ageDays = Math.floor(age / (1000 * 60 * 60 * 24));
        await command.reply(`${user.tag}, your account is ${ageDays} day(s) old.`);
    }
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

interface Command {
    name: string;
    description: string;
}

async function main() {
    const commands: Command[] = [
        {
            name: 'mimic',
            description: 'Mimic Command',
        },
        {
            name: 'howoldami',
            description: 'Checks how old your account is in days.',
        },
    ];

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );
        await client.login(TOKEN);
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

main();
