import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { hash } from 'bcrypt'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type: 'varchar', length: 255})
    email: string
    @Column({type: 'varchar', length: 255, select: false})
    password: string
    @Column({type: 'varchar', length: 500, nullable: true })
    binance_secret_api: string
    @Column({type: 'varchar', length: 500, nullable: true})
    binance_api: string
    @Column({type: 'varchar', length: 500, nullable: true})
    refreshToken: string
    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date
    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date
    @Column({type:'tinyint', default: true})
    isActive: boolean

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (!this.password) {
            return
        }
        this.password = await hash(this.password, 10)
    }
}