import { ApiProperty } from "@nestjs/swagger";

export class TokenBalanceDto {
  @ApiProperty({ example: 150.75, description: 'Общая стоимость токенов в USD в данной сети' })
  totalValue: number;

  @ApiProperty({
    type: Object,
    example: {
      USDT: 100,
      BNB: 0.25,
    },
    description: 'Баланс токенов по названиям внутри данной сети',
  })
  balanceData: Record<string, number>;
}

export class TotalBalanceDto {
  @ApiProperty({
    type: Object,
    example: {
      BSC: {
        totalValue: 150.75,
        balanceData: {
          USDT: 100,
          BNB: 0.25,
        },
      },
      ARBITRUM: {
        totalValue: 75.5,
        balanceData: {
          USDC: 75.5,
        },
      },
    },
    description: 'Агрегированный баланс пользователя по сетям',
  })
  data: Record<string, TokenBalanceDto>;
}