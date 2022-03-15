import { IsNumber, IsString } from 'class-validator'

export class payloadApiReq {
  @IsNumber()
  id: number | undefined
  @IsString()
  exchange: string
  @IsString()
  apiKey: string
  @IsString()
  secretKey: string
}
