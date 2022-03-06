import { IsNumber, IsString } from 'class-validator'

export class payloadOrderReq {
  @IsString()
  name: string
  @IsString()
  asset: string
  @IsString()
  currency: string
  @IsString()
  side: string
  @IsString()
  exchange: string
  @IsString()
  description: string
}