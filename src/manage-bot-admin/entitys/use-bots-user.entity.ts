import { User } from 'src/user/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { BotsAdmin } from './manage-bots-admin.entity'
import { transactionBotUserMapping } from './transaction-mapping.entity'
// import { Transaction } from '../public-trade/transaction-orders.entity'

@Entity()
export class BotsUserMapping {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  botIds: number
  @Column()
  userIds: number
  @Column({ default: 0 })
  round: number

  @Column({ type: 'decimal', precision: 24, scale: 9 })
  amount: number
  @Column()
  amountType: string
  @Column()
  type: string

  @Column({ default: true })
  active: boolean

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date

  @JoinColumn()
  transactionMapping: transactionBotUserMapping

  @ManyToOne(() => User, (user: User) => user.botUserMappings)
  user: User

  @ManyToOne(() => BotsAdmin, (bot: BotsAdmin) => bot.botMappingUsers, {
    cascade: true,
  })
  bot: BotsAdmin

  @OneToMany(
    () => transactionBotUserMapping,
    (transactionMappings: transactionBotUserMapping) => transactionMappings.id,
  )
  transactionMappings: transactionBotUserMapping[]
}
