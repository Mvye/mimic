import 'reflect-metadata';
import { createDatabase } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './models/User.js';
import { ShopItem } from './models/ShopItem.js';
import { UserItem } from './models/UserItem.js';

const db_options: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'mimic',
    password: 'frieren',
    database: 'mimic-test',
    synchronize: true,
    logging: false,
    entities: [User, ShopItem, UserItem],
    migrations: [],
    subscribers: [],
};

export const AppDataSource = new DataSource(db_options);

export async function addShopItem(itemName: string, cost: number) {
    try {
        const item = new ShopItem();
        item.item_name = itemName;
        item.cost = cost;

        await AppDataSource.manager.save(item);
        console.log(`Item ${itemName} added to the shop with price $${cost}.`);
    } catch (error) {
        console.error('Failed to add item to shop:', error);
    }
}

export async function populateShopItems() {
    await addShopItem('Normal Scuffed Mimic:tm: Gacha Pack', 10);
    await addShopItem('Super Rare Mimic:tm: Gacha Pack', 50);
}
