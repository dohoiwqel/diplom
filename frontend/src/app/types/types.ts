import { TokenName, NativeName, BalanceData, ChainName } from "./backendTypes";

export type StableCoin = 'USDT' | 'USDC'
export type TotalBalanceResponse = 
        Record<
            TokenName | NativeName,
            {
                totalValue: number;
                balanceData: BalanceData;
            }
        >

export type ChainBalance = {
        [chainName in ChainName]: {
            totalValueUSD: number,
            balanceData: {[tokenName in TokenName | NativeName]: number}
        }
    }