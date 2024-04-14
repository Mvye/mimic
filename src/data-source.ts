import "reflect-metadata"
import {createDatabase} from "typeorm-extension"
import { DataSource, DataSourceOptions } from "typeorm"
import { User } from "./models/User.js"
import { ShopItem } from "./models/ShopItem.js"
import { UserItem } from "./models/UserItem.js"

const db_options: DataSourceOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "mimic",
    password: "frieren",
    database: "mimic-test",
    synchronize: true,
    logging: false,
    entities: [User, ShopItem, UserItem],
    migrations: [],
    subscribers: [],
};

export const AppDataSource = new DataSource(db_options);
