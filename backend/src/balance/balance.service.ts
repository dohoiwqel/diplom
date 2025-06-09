import { Injectable } from "@nestjs/common";
import { ethers } from "ethers";
import { erc20Abi } from "./abi";
import { chainData } from "./chainData";
import { TokenName, BalanceData, ChainName, NativeName } from "src/types/types";


@Injectable()
export class BalanceService {

    async getBalance(address: string, token: TokenName | 'NATIVE'): Promise<BalanceData> {

        let dataRec: BalanceData = {
            BSC: 0,
            ARBITRUM: 0,
            OPTIMISM: 0
        }

        for(let networkName in chainData) {

            const {rpc, tokens} = chainData[networkName as ChainName]
            const provider = new ethers.JsonRpcProvider(rpc)
            
            if(token === 'NATIVE') {
                const rawBalance = await provider.getBalance(address)
                const nativeBalane = Number(ethers.formatUnits(rawBalance, 18))
                dataRec[networkName as ChainName] += nativeBalane
            } else {
                const tokenContract = new ethers.Contract(tokens[token], erc20Abi, provider)

                const [tokenRaw, tokenDec] = await Promise.all([
                    tokenContract.balanceOf(address),
                    tokenContract.decimals(),
                ])

                const tokenBalance = Number(ethers.formatUnits(tokenRaw, tokenDec))
                dataRec[networkName as ChainName] += tokenBalance
            }
        }

        return dataRec
    }

    async getTotalBalance(
        address: string
    ): Promise<
        Record<
            TokenName | NativeName,
            {
                totalValue: number;
                balanceData: BalanceData;
            }
        >
    > {

        const usdtBalance = await this.getBalance(address, 'USDT')
        const usdcBalance = await this.getBalance(address, 'USDC')
        const nativeBalance = await this.getBalance(address, 'NATIVE')

        const getTotal = (balanceData: BalanceData) => {
            let totalBalance = 0
            for(let chainName in balanceData) {
                totalBalance += balanceData[chainName as ChainName]
            }
            return totalBalance
        }

        const totalUsdt = getTotal(usdtBalance)
        const totalUsdc = getTotal(usdcBalance)

        const getTotalNative = (balanceData: BalanceData) => {
            const {BSC, ...other} = nativeBalance

            let nativeTotal: Record<NativeName, {totalValue: number, balanceData: BalanceData}> = {
                BNB: {totalValue: 0, balanceData: { BSC } as BalanceData },
                ETH: {totalValue: 0, balanceData: other as BalanceData },
            }

            for(let chainName in balanceData) {
                const nativeName = chainData[chainName as ChainName].nativeName
                nativeTotal[nativeName].totalValue += nativeBalance[chainName as ChainName]
            }
            
            return nativeTotal
        }

        const nativeTotal = getTotalNative(nativeBalance)

        return (
            {
                USDT: {totalValue: totalUsdt, balanceData: usdtBalance},
                USDC: {totalValue: totalUsdc, balanceData: usdcBalance},
                ...nativeTotal
            }
        )
    }

}
