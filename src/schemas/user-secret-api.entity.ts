import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from 'src/schemas/user.entity'

@Entity()
export class ApiSetting {
  @PrimaryGeneratedColumn()
  id: number
  @Column({ type: 'varchar', length: 128, select: false })
  exchange: string
  @Column({ type: 'varchar', length: 500, nullable: true })
  apiKey: string
  @Column({ type: 'varchar', length: 500, nullable: true })
  secretKey: string
  @Column({ default: true })
  active: boolean
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @ManyToOne(() => User, (user: User) => user.apiKey)
  user: User
}
