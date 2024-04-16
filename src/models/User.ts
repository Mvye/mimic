import {
    Entity,
    Column,
    PrimaryColumn,
    BaseEntity,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Card } from './Card.js';

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    user_id!: string;

    @Column('integer')
    balance: number = 0;

    @Column({ type: 'integer', default: 0 })
    points: number = 0;

    @ManyToMany(() => Card)
    @JoinTable()
    cards: Card[];
}
