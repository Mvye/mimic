import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from "typeorm"
import { UserItem } from "./UserItem.js"

@Entity()
export class ShopItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    @OneToMany('UserItem', 'item_id')
    item_id!: number;

    @Column("integer")
    cost!: number;
}