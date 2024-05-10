import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getBalance } from '../../utils/economy.js';
import { CommandData } from '../../utils/CommandData';

export const balance: CommandData = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Checks your scuffed currency balance, which will eventually be tradeable for packs.'),
    async execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.user;
        await interaction.reply(
            `${target.tag} has ${getBalance(target.id)}💰.`
        );
    },
}
