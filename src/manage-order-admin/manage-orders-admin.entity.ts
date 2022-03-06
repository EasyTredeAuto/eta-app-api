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
// import { Transaction } from '../public-trade/transaction-orders.entity'

@Entity()
export class ManageOrdersAdmin {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string
  @Column({ type: 'varchar', length: 10 })
  symbol: string
  @Column({ type: 'varchar', length: 10 })
  asset: string
  @Column({ type: 'varchar', length: 10 })
  currency: string
  @Column()
  side: string
  @Column({ type: 'varchar', length: 500, nullable: true })
  url: string
  @Column({ type: 'varchar', length: 50, default: "binance" })
  exchange: string
  @Column()
  description: string
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date

  @ManyToOne(() => User, (user: User) => user.orders)
  user: User

  // @OneToMany(() => Transaction, (transaction: Transaction) => transaction.id)
  // transactions: Transaction[]
}
