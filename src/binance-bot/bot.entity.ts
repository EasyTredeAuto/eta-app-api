import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Bot {
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    name: string
    @Column({type: 'varchar', length: 10})
    asset: string
    @Column({type: 'varchar', length: 10})
    currency: string
    @Column({type: 'varchar', length: 10})
    timeFleam: string
    @Column()
    amount: number
    @Column()
    amountType: string
    @Column({ default: true })
    active: boolean
    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date
    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date
    @DeleteDateColumn({type: 'timestamp', nullable: true, select: false})
    deletedAt: Date

    @ManyToOne(()=> User, (user: User) => user.bots)
    user:User
}