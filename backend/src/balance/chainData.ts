import { Chain } from "src/types/types";

export const chainData: Chain = {
  BSC: {
    rpc: "https://bsc-dataseed.binance.org/",
    tokens: {
      USDT: "0x55d398326f99059fF775485246999027B3197955",
      USDC: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"
    },
    nativeName: 'BNB'
  },
  ARBITRUM: {
    rpc: "https://arb1.arbitrum.io/rpc",
    tokens: {
      USDT: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
      USDC: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
    },
    nativeName: 'ETH'
  },
  OPTIMISM: {
    rpc: "https://optimism-rpc.publicnode.com",
    tokens: {
      USDT: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
      USDC: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85"
    },
    nativeName: 'ETH'
  },
}