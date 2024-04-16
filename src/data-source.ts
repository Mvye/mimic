import 'reflect-metadata';
import { createDatabase } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './models/User.js';
import { ShopItem } from './models/ShopItem.js';
import { UserItem } from './models/UserItem.js';
import { Card } from './models/Card.js';

const db_options: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'mimic',
    password: 'frieren',
    database: 'mimic-test',
    synchronize: true,
    logging: false,
    entities: ['dist/models/*.js'],
    migrations: [],
    subscribers: [],
};

export const AppDataSource = new DataSource(db_options);

// Functions to populate the database with initial data
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

export async function addCardToTable(card: Card) {
    try {
        await AppDataSource.manager.save(card);
        console.log(`Card ${card.card_name} added to the card table.`);
    } catch (error) {
        console.error('Failed to add card to table:', error);
    }
}

// Populate tables with initial objects
export async function populateShopItems() {
    await addShopItem('Normal Scuffed Mimic:tm: Gacha Pack', 10);
    await addShopItem('Super Rare Mimic:tm: Gacha Pack', 50);
}

export async function populateCards() {
    const card1 = new Card();
    card1.card_name = 'Jackbox Content Aware Po';
    card1.image_url = 'https://i.postimg.cc/Y9MKDVWX/contentawarepo.png';
    card1.rarity = 3;
    card1.description = 'Bruh.';
    card1.points_effect = -250;

    const card2 = new Card();
    card2.card_name = 'Bonk';
    card2.image_url = 'https://i.postimg.cc/QMpZbsH9/bonk.png';
    card2.rarity = 4;
    card2.description = 'Get bonked.';
    card2.points_effect = -400;

    const card3 = new Card();
    card3.card_name = 'Right Leg of the Forbidden One';
    card3.image_url = 'https://i.postimg.cc/76ss1QMJ/rightleg.png';
    card3.rarity = 5;
    card3.description = 'If you collect all 5 pieces, instantly win the game.';

    await addCardToTable(card1);
    await addCardToTable(card2);
    await addCardToTable(card3);
}
