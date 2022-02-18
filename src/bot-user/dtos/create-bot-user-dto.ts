import { IsNumber, IsString } from "class-validator";

export class payloadBotReq {
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
}