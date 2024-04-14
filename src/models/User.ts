import { Entity, Column, PrimaryColumn, OneToMany, BaseEntity } from "typeorm"
import { UserItem } from "./UserItem.js"

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    @OneToMany('UserItem', 'user_id')
    user_id!: string;

    @Column("integer")
    balance: number = 0;
}