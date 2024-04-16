import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    BaseEntity,
    ManyToMany,
} from 'typeorm';

@Entity()
export class Card extends BaseEntity {
    @PrimaryGeneratedColumn()
    card_id!: number;

    @Column()
    card_name: string;

    @Column()
    image_url: string;

    @Column('integer')
    rarity: number;

    @Column()
    description: string;

    @Column({ type: 'integer', nullable: true })
    points_effect: number = 0;
}
