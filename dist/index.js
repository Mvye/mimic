import { config } from 'dotenv';
import { Client, GatewayIntentBits, REST, Routes, Collection, Events, EmbedBuilder } from 'discord.js';
import { User } from "./models/User.js";
import { AppDataSource } from "./data-source.js";
import { roll } from './gacha.js';
config();
AppDataSource.initialize();
// Explicitly declare these as strings and provide default values or handle undefined cases
const TOKEN = process.env.MIMIC_BOT_TOKEN ?? '';
const CLIENT_ID = process.env.MIMIC_BOT_CLIENT_ID ?? '';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const currency = new Collection();
async function addBalance(id, amount) {
    console.log(id, amount);
    let user = currency.get(id);
    if (user) {
        console.log(user);
        user.balance += amount;
    }
    else {
        console.log("Attempting to initialize new User");
        let new_user = new User();
        new_user.user_id = id;
        new_user.balance = amount;
        user = new_user;
    }
    await AppDataSource.manager.save(User, user);
    currency.set(id, user);
    return user;
}
function getBalance(id) {
    const user = currency.get(id);
    return user ? user.balance : 0;
}
client.on(Events.ClientReady, async (readyClient) => {
    const storedBalances = await AppDataSource.manager.query(`SELECT * FROM public.user`);
    console.log(storedBalances);
    storedBalances.forEach(b => currency.set(b.user_id, b));
    // Check if client.user is not null before logging
    if (client.user) {
        console.log(`Logged in as ${client.user.tag}!`);
    }
    else {
        console.log('Client logged in, but user details are not available.');
    }
});
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot)
        return;
    console.log(`Detected message from ${message.author.id}`);
    addBalance(message.author.id, 1);
});
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    const command = interaction;
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
    if (command.commandName === 'faucet') {
        const target = interaction.options.getUser('user') ?? interaction.user;
        addBalance(target.id, 5);
    }
    if (command.commandName === 'gacha') {
        // todo: Check for sufficient balance
        const resultIndex = roll();
        let resultHexColor;
        if (resultIndex === 3) {
            resultHexColor = 0x1183a6;
        }
        else if (resultIndex === 4) {
            resultHexColor = 0x9411a6;
        }
        else {
            resultHexColor = 0xd4a715;
        }
        ;
        const embedResult = new EmbedBuilder()
            .setTitle("Roll Results")
            .setDescription(`${command.user.displayName}, you have rolled a ${resultIndex}⭐.`)
            .setColor(resultHexColor)
            .setImage(command.user.avatarURL());
        await command.reply({
            embeds: [embedResult]
        });
    }
});
const rest = new REST({ version: '10' }).setToken(TOKEN);
async function main() {
    const commands = [
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
        },
        {
            name: 'faucet',
            description: 'Get a bit of currency.'
        },
        {
            name: 'gacha',
            description: 'What will you get?'
        }
    ];
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        await client.login(TOKEN);
        console.log('Successfully reloaded application (/) commands.');
    }
    catch (error) {
        console.error(error);
    }
}
main();
