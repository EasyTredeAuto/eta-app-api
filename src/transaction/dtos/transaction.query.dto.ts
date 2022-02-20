import { IsDateString, IsNumber, IsString } from 'class-validator'

export class transactionQueryReq {
  @IsNumber()
  bot: number
  @IsNumber()
  user: number
  @IsString()
  symbol?: string
  @IsString()
  name?: string
  @IsString()
  side?: string
  @IsString()
  type?: string
//   @IsDateString()
//   createdAt?: Date
}
