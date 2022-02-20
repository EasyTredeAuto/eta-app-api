import { IsNumber, IsString } from 'class-validator'

export class payloadBotReq {
  @IsString()
  email
  @IsString()
  name
  @IsString()
  symbol: string
  @IsNumber()
  amount: number
  @IsString()
  amountType: string
  @IsString()
  side: string
  @IsString()
  type: string
}
