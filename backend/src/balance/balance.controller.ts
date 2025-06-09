import { Controller, Get, Param } from "@nestjs/common";
import { BalanceService } from "./balance.service";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { TotalBalanceDto } from "./dto";


@Controller('/balance')
export class BalanceController {

    constructor(private balanceService: BalanceService) { }

    @Get(':address')
    @ApiOperation({ summary: 'Получение агрегированного баланса пользователя по адресу' })
    @ApiParam({ name: 'address', description: 'Публичный адрес пользователя в блокчейне' })
    @ApiResponse({
        status: 200,
        description: 'Успешное получение баланса',
        type: TotalBalanceDto, // Опишите DTO по вашей структуре ответа
    })
    @ApiResponse({
        status: 404,
        description: 'Пользователь с таким адресом не найден или нет активов',
    })
    @ApiResponse({
        status: 400,
        description: 'Неверный формат адреса',
    })
    getTotalBalance(@Param('address') address: string) {
        return this.balanceService.getTotalBalance(address);
    }

}