import { IsDateString, IsNumber, IsString } from 'class-validator'

export class transactionQueryReq {
  @IsNumber()
  page: number
  @IsNumber()
  size: number
  @IsDateString()
  from: Date
  @IsDateString()
  to: Date
  @IsString()
  exchange?: string
  @IsString()
  symbol?: string
  @IsString()
  side?: string
  @IsString()
  type?: string
  //   @IsDateString()
  //   createdAt?: Date
}
