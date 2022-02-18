import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Transaction } from "./transaction-mybot.entity";

@Entity()
export class MyBot {
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    name: string
    @Column({type: 'varchar', length: 10})
    asset: string
    @Column({type: 'varchar', length: 10})
    currency: string
    @Column()
    amount: number
    @Column()
    amountType: string
    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date
    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date
    @DeleteDateColumn({type: 'timestamp'})
    deletedAt: Date

    @Column()
    defaultUserId: number

    @ManyToOne(()=> User, (user: User) => user.myBot, {onUpdate: 'CASCADE', onDelete: 'CASCADE'})
    user: User

    @JoinColumn()
    transaction: Transaction

    @OneToMany(() => Transaction, (transaction:Transaction) => transaction.id)
    transactions: Transaction[]
}