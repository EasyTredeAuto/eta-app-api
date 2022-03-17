import { User } from 'src/schemas/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Orders } from './user-url-orders.entity'

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  orderIds: number
  @Column({ type: 'varchar', length: 10 })
  symbol: string
  @Column({ type: 'decimal', precision: 24, scale: 9 })
  amount: number
  @Column({ type: 'decimal', precision: 24, scale: 9 })
  quantity: number
  @Column({ type: 'decimal', precision: 24, scale: 9 })
  price: number
  @Column({ type: 'varchar', length: 10 })
  side: string
  @Column({ type: 'varchar', length: 10 })
  type: string
  @Column({ default: 'binance', type: 'varchar', length: 10 })
  exchange: string
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @ManyToOne(() => Orders, (order: Orders) => order.transactions)
  order: Orders

  @ManyToOne(() => User, (user: User) => user.transactions)
  user: User
}
