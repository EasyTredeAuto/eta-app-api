import { IsBoolean, IsDecimal, IsNumber, IsString } from 'class-validator'

export class payloadBotMappingReq {
  @IsDecimal({ type: 'decimal', precision: 24, scale: 9 })
  amount: string
  @IsString()
  amountType: string
  @IsString()
  type: string
  @IsNumber()
  botId: string
}

export class payloadActiveBotMappingReq {
  @IsBoolean()
  active: boolean
  @IsNumber()
  botId: string
}