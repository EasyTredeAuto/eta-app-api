import { User } from 'src/schemas/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { BotsAdmin } from './admin-bots.entity'
import { BotsUserMapping } from './mapping-user-bots.entity'

@Entity()
export class transactionBotUserMapping {
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

  @ManyToOne(() => User, (user: User) => user.transactionMappings)
  user: User

  @ManyToOne(() => BotsAdmin, (user: BotsAdmin) => user.transactionMappings)
  bot: BotsAdmin

  @ManyToOne(
    () => BotsUserMapping,
    (bot: BotsUserMapping) => bot.transactionMappings,
  )
  mapping: BotsUserMapping
}
