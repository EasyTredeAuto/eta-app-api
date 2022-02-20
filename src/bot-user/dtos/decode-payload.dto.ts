import { IsNumber, IsString } from 'class-validator'

export class payloadBotDe {
  @IsNumber()
  botId: number
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
  @IsNumber()
  iat: number
  @IsNumber()
  exp: number
}
