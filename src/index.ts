import { config } from 'dotenv';
import { Client, GatewayIntentBits, REST, Routes, ChatInputCommandInteraction, Interaction, codeBlock, Collection, Events, EmbedBuilder } from 'discord.js';
import { User } from "./models/User.js"
import { ShopItem } from "./models/ShopItem.js"
import { UserItem } from "./models/UserItem.js"
import { AppDataSource, populateShopItems } from "./data-source.js"
import { roll } from './gacha.js';

config();
async function db_init() {
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");
        await populateShopItems();
    } catch (error) {
        console.error("Error during Data Source initialization or operation:", error);
    }
}
db_init();

// Explicitly declare these as strings and provide default values or handle undefined cases
const TOKEN: string = process.env.MIMIC_BOT_TOKEN ?? '';
const CLIENT_ID: string = process.env.MIMIC_BOT_CLIENT_ID ?? '';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const currency: Collection<string, User> = new Collection();

async function addBalance(id: string, amount: number): Promise<User> {
	let user: User = currency.get(id);

	if (user) {
		user.balance += amount;
	} else {
        console.log("Attempting to initialize new User")
        let new_user: User = new User()
        new_user.user_id = id
        new_user.balance = amount
        user = new_user
    }
    console.log(`Called addBalance on user ${id} with amount ${amount}, user has balance ${user.balance}.`)

    await AppDataSource.manager.save(User, user)
    currency.set(id, user);
    return user;
}

function getBalance(id: string): number {
	const user = currency.get(id);
	return user ? user.balance : 0;
}

// async function getItems(id: string){
//     const userItems = await AppDataSource.manager.query(`SELECT * FROM public.user_item WHERE user_id = ${id}`)
//     console.log(userItems)
// }

client.on(Events.ClientReady, async readyClient => {
    const storedBalances = await AppDataSource.manager.query(`SELECT * FROM public.user`);
    console.log(storedBalances)
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
    console.log(`Detected message from ${message.author.id}`)
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

    if (command.commandName === 'balance') {
		const target = interaction.options.getUser('user') ?? interaction.user;
		await command.reply(`${target.tag} has ${getBalance(target.id)}💰`);
	}

    if (command.commandName === 'faucet') {
		const target = interaction.options.getUser('user') ?? interaction.user;
		addBalance(target.id, 5);
	}

    if (command.commandName === 'gacha') {
        const currentAmount = getBalance(interaction.user.id);
        const tempGachaCost = 5;

        if (tempGachaCost > currentAmount) await command.reply(`Sorry ${interaction.user}, you have ${currentAmount}💰 and a roll costs ${tempGachaCost}💰.`)
        else {
            addBalance(interaction.user.id, -tempGachaCost)

            const resultIndex = roll();
            let resultHexColor : number;
            if (resultIndex === 3) { resultHexColor = 0x1183a6; }
            else if (resultIndex === 4) { resultHexColor = 0x9411a6; }
            else { resultHexColor = 0xd4a715 };
            const embedResult = new EmbedBuilder()
            .setTitle("Roll Results")
            .setDescription(`${command.user.displayName}, you have rolled a ${resultIndex}⭐.`)
            .setColor(resultHexColor)
            .setImage(command.user.avatarURL());
            await command.reply({
                embeds: [embedResult]
            });
        }

    }

    if (command.commandName === 'transfer') {
        const currentAmount = getBalance(interaction.user.id);
        const transferAmount = interaction.options.getInteger('amount');
        const transferTarget = interaction.options.getUser('user');
    
        if (transferAmount > currentAmount) await command.reply(`Sorry ${interaction.user}, you only have ${currentAmount}.`)
        else if (transferAmount <= 0) await command.reply(`Please enter an amount greater than zero, ${interaction.user}.`)
        else {
            addBalance(interaction.user.id, -transferAmount);
            addBalance(transferTarget.id, transferAmount);
        
            await interaction.reply(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${getBalance(interaction.user.id)}💰`);
        }
    }
});

const rest = new REST({ version: '10' }).setToken(TOKEN);


interface CommandOptions {
    name: string,
    description: string,
    type: number,
    required?: boolean,
    choices?: any,
    min_value?: number,
    max_value?: number,
}

interface Command {
    name: string;
    description: string;
    options?: CommandOptions[]
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
            name: 'balance',
            description: 'Checks your scuffed currency balance, which will eventually be tradeable for packs.',
        },
        {
            name: 'faucet',
            description: 'Get a bit of currency.'
        },
        {
            name: 'gacha',
            description: 'What will you get? ($5)'
        },
        {
            name: 'transfer',
            description: 'Transfer some cash.',
            options: [
                {
                    name: 'user',
                    type: 6,
                    description: 'Recipient of cash',
                    required: true
                },
                {
                    name: 'amount',
                    type: 4,
                    description: 'Amount of cash',
                    required: true,
                    min_value: 0
                }
            ]
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
