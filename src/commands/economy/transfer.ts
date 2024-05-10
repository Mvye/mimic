import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { addBalance, getBalance } from '../../utils/economy.js';
import { CommandData } from '../../utils/CommandData';

export const transfer: CommandData = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('Transfer some cash.')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Recipient of cash')
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('amount')
            .setDescription('Amount of cash')
            .setRequired(true)
            .setMinValue(0)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const currentAmount = getBalance(interaction.user.id);
        const transferAmount = interaction.options.getInteger('amount');
        const transferTarget = interaction.options.getUser('user');
        if (transferAmount > currentAmount)
            await interaction.reply(
                `Sorry ${interaction.user}, you only have ${currentAmount}.`
            );
        else if (transferAmount <= 0)
            await interaction.reply(
                `Please enter an amount greater than zero, ${interaction.user}.`
            );
        else {
            addBalance(interaction.user.id, -transferAmount);
            addBalance(transferTarget.id, transferAmount);
            await interaction.reply(
                `Successfully transferred ${transferAmount}💰 to ${
                    transferTarget.tag
                }. Your current balance is ${getBalance(interaction.user.id)}💰`
            );
        }
    },
};
