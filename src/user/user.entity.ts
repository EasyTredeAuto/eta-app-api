import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { hash } from 'bcrypt'
import { Bot } from "src/binance-bot/bot.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    email: string
    @Column({type: 'varchar', length: 128, select: false })
    password: string
    @Column({type: 'varchar', length: 500, nullable: true, select: false })
    binance_secret_api: string
    @Column({type: 'varchar', length: 500, nullable: true, select: false})
    binance_api: string
    @Column({ type: 'simple-array'})
    roles: string[]
    @Column({ default: true })
    active: boolean
    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date
    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date
    @DeleteDateColumn({type: 'timestamp', nullable: true, select: false})
    deletedAt: Date
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (!this.password) {
            return
        }
        this.password = await hash(this.password, 10)
    }

    @JoinColumn()
    bot: Bot

    @OneToMany(()=>Bot, (bot:Bot) => bot.id)
    bots: Bot[]
}