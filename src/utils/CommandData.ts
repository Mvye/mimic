import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export interface CommandData {
    data: Partial<SlashCommandBuilder>;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}