import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { apiKey } from "./apiKeys";
// import { responseARBI, responseBNB, responseOP } from "./responseExample";
import { ChainName, ExplorerTokenTransfer, TokenTransfer } from "src/types/types";

@Injectable()
export class HistoryService {

    constructor(private readonly axios: HttpService) { }

    async makeRequest(address: string, chain: string) {
        let url = `https://deep-index.moralis.io/api/v2.2/${address}/erc20/transfers?chain=${chain}`

        const { data } = await firstValueFrom(this.axios.get(
            url,
            {
                headers: {
                    'X-API-Key': apiKey
                }
            }
        ))

        return data
    }

    async getHistory(address: string) {
        
        const responseARBI = await this.makeRequest(address, 'arbitrum')
        const responseOP = await this.makeRequest(address, 'optimism')
        const responseBNB = await this.makeRequest(address, 'bsc')

        const formatARBI: ExplorerTokenTransfer[] = responseARBI.result.map(el => {
            return { ...el, explorer: 'https://arbiscan.io/', chain: 'ARBITRUM' };
        });
        const formatOP: ExplorerTokenTransfer[] = responseOP.result.map(el => {
            return { ...el, explorer: 'https://optimistic.etherscan.io/', chain: 'OPTIMISM' };
        });
        const formatBNB: ExplorerTokenTransfer[] = responseBNB.result.map(el => {
            return { ...el, explorer: 'https://bscscan.com/', chain: 'BSC' };
        });

        const dataArray: TokenTransfer[] = [...formatARBI, ...formatOP, ...formatBNB]
        const sortedData = dataArray.sort((a, b) => {
            return new Date(b.block_timestamp).getTime() - new Date(a.block_timestamp).getTime();
        });

        const data = sortedData
        return data
    }

}