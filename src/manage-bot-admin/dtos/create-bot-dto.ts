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
  @IsString()
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
  @IsString()
  botId: number
  @IsString()
  side: number
}