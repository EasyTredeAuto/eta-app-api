import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm'
import { hash } from 'bcrypt'
import { Orders } from 'src/manage-order/manage-orders.entity'
import { AppRoles } from 'src/app.roles'
import { Transaction } from 'src/public-trade/transaction-orders.entity'
import { BotsAdmin } from 'src/manage-bot-admin/manage-bots-admin.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  email: string
  @Column({ type: 'varchar', length: 128, select: false })
  password: string
  @Column({ type: 'varchar', length: 500, nullable: true, select: false })
  binance_secret_api: string
  @Column({ type: 'varchar', length: 500, nullable: true, select: false })
  binance_api: string

  @Column({ default: AppRoles.AUTHOR })
  roles: string

  @Column({ default: true })
  active: boolean
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
  @DeleteDateColumn({ type: 'timestamp', nullable: true, select: false })
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
  bot: BotsAdmin

  @JoinColumn()
  order: Orders

  @JoinColumn()
  transaction: Orders

  @OneToMany(() => BotsAdmin, (bot: BotsAdmin) => bot.id)
  bots: BotsAdmin[]

  @OneToMany(() => Orders, (order: Orders) => order.id)
  orders: Orders[]

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.id)
  transactions: Transaction[]
}
