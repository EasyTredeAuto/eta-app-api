import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type: 'varchar', length: 255})
    email: string
    @Column({type: 'varchar', length: 255})
    password: string
    @Column({type: 'varchar', length: 500, nullable: true})
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
}