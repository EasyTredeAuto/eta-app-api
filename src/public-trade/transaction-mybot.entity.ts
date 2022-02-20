import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { MyBot } from '../bot-user/mybot.entity'

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number
  @Column({ type: 'varchar', length: 10 })
  symbol: string
  @Column({ type: 'decimal', precision: 24, scale: 9 })
  amount: number
  @Column({ type: 'decimal', precision: 24, scale: 9 })
  quantity: number
  @Column({ type: 'decimal', precision: 24, scale: 9 })
  price: number
  @Column()
  side: string
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @ManyToOne(() => MyBot, (myBot: MyBot) => myBot.transactions)
  bot: MyBot
}
