import { IsNumber, IsString } from 'class-validator'

export class payloadBotReq {
  @IsString()
  symbol: string
  @IsString()
  name: string
  @IsString()
  detail: string
  @IsString()
  asset: string
  @IsString()
  currency: string
}
export class payloadUpdateBotReq {
  @IsNumber()
  id: number
  @IsString()
  symbol: string
  @IsString()
  name: string
  @IsString()
  detail: string
  @IsString()
  asset: string
  @IsString()
  currency: string
}

export class payloadBotUpdateReq {
  @IsNumber()
  id: number
  @IsString()
  symbol: string
  @IsString()
  name: string
  @IsString()
  detail: string
  @IsString()
  asset: string
  @IsString()
  currency: string
}

export class payloadBotToken {
  @IsNumber()
  id: number
  @IsNumber()
  email: string
  @IsNumber()
  botId: number
  @IsString()
  side: string
  @IsString()
  symbol: string
  @IsString()
  name: string
  @IsString()
  detail: string
  @IsString()
  asset: string
  @IsString()
  currency: string
}
