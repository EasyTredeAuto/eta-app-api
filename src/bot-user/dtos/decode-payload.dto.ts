import { IsNumber, IsString } from "class-validator";

export class payloadBotDe {
    @IsNumber()
    id: number
    @IsString()
    email
    @IsString()
    name
    @IsString()
    asset: string
    @IsString()
    currency: string
    @IsNumber()
    amount: number
    @IsString()
    amountType: string
    @IsString()
    side: string
    @IsString()
    type: string
    @IsNumber()
    iat: number
    @IsNumber()
    exp: number
}