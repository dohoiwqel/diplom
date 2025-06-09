import { Controller, Get } from "@nestjs/common";
import { PriceService } from "./price.service";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";


@Controller('')
export class PriceController {
    constructor(private priceService: PriceService) { }

    @Get('prices')
    @ApiParam({
        name: 'tokenname',
        description: 'Название токена (например, USDT, ETH, BNB)',
        required: true,
        example: 'USDT',
    })
    @ApiResponse({
        status: 200,
        description: 'Актуальная цена токена в долларах США',
        schema: {
        example: {
            token: 'USDT',
            price: 0.9997,
            currency: 'USD',
        },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Токен не найден или не поддерживается системой',
    })
    @ApiOperation({ summary: 'Получение цены токена по его названию' })
    getTokenPrice() {
        return this.priceService.getPrices()
    }
}