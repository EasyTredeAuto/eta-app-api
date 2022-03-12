import { User } from 'src/user/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Orders } from '../manage-order/manage-orders.entity'

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
  @Column()
  type: string
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @ManyToOne(() => Orders, (order: Orders) => order.transactions)
  order: Orders

  @ManyToOne(() => User, (user: User) => user.transactions)
  user: User
}
