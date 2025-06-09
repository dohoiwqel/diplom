import { STABLECOINS, TOKEN_PRICE_MAP } from "../constants";
import { ChainName, NativeName, TokenName } from "../types/backendTypes";
import { ChainBalance, StableCoin, TotalBalanceResponse } from "../types/types";
import { getPrices } from "./backendAPI";

export function calculateTotalValueUSD(chainBalance: ChainBalance) {

    let totalValue = 0

    for(let chainName in chainBalance) {
        const cName = chainName as ChainName
        totalValue += chainBalance[cName].totalValueUSD
    }

    return totalValue
}

export async function calculateChainBalance(totalBalance: TotalBalanceResponse) {
    
    const record: Record<string, {totalValueUSD: number, balanceData: Record<string, number>}> = {}
    const priceData = await getPrices()

    for(let tokenName in totalBalance) {
        const tName = tokenName as NativeName | TokenName

        for(let chainName in totalBalance[tName].balanceData) {
            const cName = chainName as ChainName

            if(!record[cName]) {
                record[cName] = {totalValueUSD: 0, balanceData: {}}
            }

            if(STABLECOINS.includes(tName as StableCoin)) {
                record[cName].totalValueUSD += totalBalance[tName].balanceData[cName]
            
            } else {
                const price = Number(priceData[TOKEN_PRICE_MAP[tName]].usd)
                record[cName].totalValueUSD += totalBalance[tName].balanceData[cName]*price
            }

            record[cName].balanceData[tName] = totalBalance[tName].balanceData[cName]
        }
    }

    return record as ChainBalance
}