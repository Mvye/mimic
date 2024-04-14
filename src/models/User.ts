import { Entity, Column, PrimaryColumn, OneToMany, BaseEntity } from "typeorm"

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    user_id!: string;

    @Column("integer")
    balance: number = 0;
}