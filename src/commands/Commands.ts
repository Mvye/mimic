import { CommandData } from "../utils/CommandData";
import { balance } from "./economy/balance.js";
import { transfer } from "./economy/transfer.js";
import { howoldami } from "./utility/howoldami.js";

const commands: Map<string, CommandData> = new Map();

//commands.set(balance.data.name, balance);
//commands.set(transfer.data.name, transfer);
commands.set(howoldami.data.name, howoldami);

export default commands;