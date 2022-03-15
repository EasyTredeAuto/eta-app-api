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
import { transactionBotUserMapping } from './transaction-mapping.entity'
import { BotsUserMapping } from './use-bots-user.entity'
// import { Transaction } from '../public-trade/transaction-orders.entity'

@Entity()
export class BotsAdmin {
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
  detail: string
  @Column({ type: 'text', nullable: true })
  urlBuy: string
  @Column({ type: 'text', nullable: true })
  urlSell: string
  @Column({ default: true })
  active: boolean
  @Column({ type: 'varchar', length: 50, default: 'binance' })
  exchange: string
  @Column({ default: 0 })
  round: number
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date

  @JoinColumn()
  botMappingUser: BotsUserMapping

  @JoinColumn()
  transactionMapping: transactionBotUserMapping

  @ManyToOne(() => User, (user: User) => user.bots)
  user: User

  @OneToMany(() => BotsUserMapping, (user: BotsUserMapping) => user.id)
  botMappingUsers: BotsUserMapping[]

  @OneToMany(
    () => transactionBotUserMapping,
    (user: transactionBotUserMapping) => user.id,
  )
  transactionMappings: transactionBotUserMapping[]
}
