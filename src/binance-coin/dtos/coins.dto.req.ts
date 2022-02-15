import { IsString } from "class-validator";

export class CoinsPriceReqDto {
    @IsString()
    symbol?: string
}