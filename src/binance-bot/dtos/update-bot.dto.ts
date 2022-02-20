import { IsNumber, IsString } from 'class-validator'

export class UpdateBotDto {
  @IsString()
  name?: string
  @IsString()
  asset?: string
  @IsString()
  currency?: string
  @IsString()
  timeFleam?: string
  @IsNumber()
  amount?: number
  @IsString()
  amountType?: string
  @IsNumber()
  userId: number
}
