import { User } from 'src/user/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Transaction } from '../public-trade/transaction-mybot.entity'

@Entity()
export class MyBot {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string
  @Column({ type: 'varchar', length: 10 })
  symbol: string
  @Column()
  amount: number
  @Column()
  amountType: string
  @Column()
  side: string
  @Column()
  type: string
  @Column({ type: 'varchar', length: 500, nullable: true })
  url: string
  @Column({ default: 0 })
  round: number
  @Column({ default: true })
  active: boolean
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date

  @JoinColumn()
  transaction: Transaction

  @ManyToOne(() => User, (user: User) => user.myBots)
  user: User

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.id)
  transactions: Transaction[]
}
