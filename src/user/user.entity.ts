import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";

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
    @Column({type: 'timestamp'})
    createdAt: Date
    @Column({type: 'timestamp'})
    updatedAt: Date
    @Column({type:'tinyint', default: true})
    isActive: boolean
}