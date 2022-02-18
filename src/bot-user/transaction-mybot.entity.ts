import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MyBot } from "./mybot.entity";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type: 'varchar', length: 10})
    symbol: string
    @Column()
    amount: number
    @Column()
    quantity: number
    @Column()
    price: number
    @Column()
    side: string
    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date
    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date
    
    @Column()
    defaultBotId: number

    @ManyToOne(()=> MyBot, (myBot: MyBot) => myBot.transactions)
    botId: MyBot
}