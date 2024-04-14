import { config } from 'dotenv';
import { Client, GatewayIntentBits, REST, Routes, ChatInputCommandInteraction, Interaction, codeBlock, Collection, Events } from 'discord.js';
import { User } from "./models/User.js"
import { ShopItem } from "./models/ShopItem.js"
import { UserItem } from "./models/UserItem.js"
import { AppDataSource } from "./data-source.js"

config();
AppDataSource.initialize();

// Explicitly declare these as strings and provide default values or handle undefined cases
const TOKEN: string = process.env.MIMIC_BOT_TOKEN ?? '';
const CLIENT_ID: string = process.env.MIMIC_BOT_CLIENT_ID ?? '';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const currency: Collection<string, User> = new Collection();

async function addBalance(id: string, amount: number): Promise<User> {
	let user: User = currency.get(id);

	if (user) {
		user.balance += amount;
	} else {
        let user: User = new User()
        user.user_id = id
        user.balance = amount
    }

    await AppDataSource.manager.save(user)
    currency.set(id, user);
    return user;
}

function getBalance(id: string): number {
	const user = currency.get(id);
	return user ? user.balance : 0;
}

client.on(Events.ClientReady, async readyClient => {
    const storedBalances = await AppDataSource.manager.find(User);
    storedBalances.forEach(b => currency.set(b.user_id, b))

    // Check if client.user is not null before logging
    if (client.user) {
        console.log(`Logged in as ${client.user.tag}!`);
    } else {
        console.log('Client logged in, but user details are not available.');
    }
});

client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;
    addBalance(message.author.id, 1);
})

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

    if (command.commandName === 'howmanyprimos') {
		const target = interaction.options.getUser('user') ?? interaction.user;
		await command.reply(`${target.tag} has ${getBalance(target.id)}💰`);
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
        {
            name: 'howmanyprimos',
            description: 'Checks your scuffed currency balance, which will eventually be tradeable for packs.',
        }
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
