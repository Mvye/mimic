import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CommandData } from '../../utils/CommandData';

export const howoldami: CommandData = {
    data: new SlashCommandBuilder()
        .setName('howoldami')
        .setDescription('Checks how old your account is in days.'),
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.user;
        const age = Date.now() - user.createdTimestamp;
        const ageDays = Math.floor(age / (1000 * 60 * 60 *24));
        await interaction.reply(
            `${user.tag}, your account is ${ageDays} day(s) old.`
        );
    },
};
