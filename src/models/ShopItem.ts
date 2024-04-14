import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from "typeorm"

@Entity()
export class ShopItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    item_id!: number;

    @Column("integer")
    cost!: number;
}