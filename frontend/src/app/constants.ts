import { ChainName, NativeName, TokenName } from "./types/backendTypes"
import { StableCoin } from "./types/types"

export const BACKEND_URL = "http://localhost:3333"
export const STABLECOINS: StableCoin[] = ["USDC", "USDT"]
export const CHAINS: ChainName[] = ["ARBITRUM", "BSC", "OPTIMISM"]

export const TOKEN_ICONS_MAP: Record<NativeName | TokenName, string> = {
    USDT: '/usdt-icon.png',
    USDC: '/usdc-icon.png',
    BNB: '/bnbCoin-icon.png',
    ETH: '/eth-icon.png',
}

export const CHAIN_ICONS_MAP: Record<ChainName, string> = {
    ARBITRUM: '/arbitrum-icon.png',
    BSC: '/bnb-icon.png',
    OPTIMISM: '/optimism-icon.png'
}

export const CHAIN_COLOR_MAP: Record<ChainName, string> = {
    ARBITRUM: '#0facfe',
    OPTIMISM: '#ff0520ba',
    BSC: '#eebc0d',
}
export const TOKEN_PRICE_MAP: Record<NativeName | TokenName, string> = {
    USDT: 'tether',
    USDC: 'usd-coin',
    ETH: 'ethereum',
    BNB: 'binancecoin'
}