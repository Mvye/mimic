import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from "typeorm";
import { User } from "./User.js"
import { ShopItem } from "./ShopItem.js"


@Entity()
export class UserItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne('User', 'user_id')
    user_id!: User;

    @ManyToOne('ShopItem', 'item_id')
    item_id!: ShopItem;

    @Column()
    amount!: number
}