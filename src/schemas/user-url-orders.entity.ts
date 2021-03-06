import { User } from 'src/schemas/user.entity'
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
import { Transaction } from './user-url-orders-transaction.entity'

@Entity()
export class Orders {
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
  @Column({ type: 'decimal', precision: 24, scale: 9 })
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

  @ManyToOne(() => User, (user: User) => user.orders)
  user: User

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.id)
  transactions: Transaction[]
}
