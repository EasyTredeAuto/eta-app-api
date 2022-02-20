import { IsString } from 'class-validator'

export class CoinsResDto {
  @IsString()
  symbol: string
  @IsString()
  bidPrice: string
  @IsString()
  bidQty: string
  @IsString()
  askPrice: string
  @IsString()
  askQty: string
}

export class CoinsPriceResDto {
  @IsString()
  symbol: string
  @IsString()
  price: string
}
