import { IsBoolean, IsNumber, IsString } from "class-validator";

export class EditUserDto  {

    @IsNumber()
    id: number

    @IsString()
    binance_secret_api: string

    @IsString()
    binance_api: string

    @IsString()
    roles: string[]

    @IsBoolean()
    active:boolean
}