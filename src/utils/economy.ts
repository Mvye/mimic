import { Collection } from "discord.js";
import { User } from '../models/User.js';
import { AppDataSource } from "../data-source.js";

const currency: Collection<string, User> = new Collection();
export async function addBalance(id: string, amount: number): Promise<User> {
    let user: User = currency.get(id);
    if (user) {
        user.balance += amount;
    } else {
        console.log('Attempting to initialize new User');
        let new_user: User = new User();
        new_user.user_id = id;
        new_user.balance = amount;
        user = new_user;
    }
    console.log(
        `Called addBalance on user ${id} with amount ${amount}, user has balance ${user.balance}.`
    );
    await AppDataSource.manager.save(User, user);
    currency.set(id, user);
    return user;
}
export function getBalance(id: string): number {
    const user = currency.get(id);
    return user ? user.balance : 0;
}