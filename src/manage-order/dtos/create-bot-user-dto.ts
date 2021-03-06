import { IsNumber, IsString } from 'class-validator'

export class payloadOrderReq {
  @IsString()
  email: string
  @IsString()
  name: string
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

export class payloadOrderUpdateReq {
  @IsNumber()
  id: number
  @IsString()
  name: string
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
