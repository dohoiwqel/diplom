export type ChainName = 'BSC' | 'OPTIMISM' | 'ARBITRUM'
export type TokenName = 'USDT' | 'USDC'
export type NativeName = 'BNB' | 'ETH'
export type BalanceData = Record<ChainName, number>

export interface ChainConfig {
  rpc: string;
  tokens: {
    [key in TokenName]: string
  },
  nativeName: NativeName
}

export type Chain = Record<ChainName, ChainConfig>

export type PriceData = {
  [token: string]: {
    usd: string,
    rub: string,
  }
}

export interface TokenTransfer {
  token_name: string;
  token_symbol: string;
  token_logo: string;
  token_decimals: string;
  from_address_entity: string | null;
  from_address_entity_logo: string | null;
  from_address: string;
  from_address_label: string | null;
  to_address_entity: string | null;
  to_address_entity_logo: string | null;
  to_address: string;
  to_address_label: string | null;
  address: string;
  block_hash: string;
  block_number: string;
  block_timestamp: string; // ISO format
  transaction_hash: string;
  transaction_index: number;
  log_index: number;
  value: string; // raw value (e.g. "1000000" for 1 USDT if 6 decimals)
  value_decimal: string; // converted to decimal (e.g. "1")
  possible_spam: boolean;
  verified_contract: boolean;
  security_score: number | null;
}

export interface TokenTransferResponse {
  page: number;
  page_size: number;
  cursor: string | null;
  result: TokenTransfer[];
}

export interface ExplorerTokenTransfer extends TokenTransfer {
    explorer: string,
    chain: ChainName
}

export interface RegisterUserDto {
    walletAddress: string,
    name: string,
    surname: string,
    email: string,
    alias?: string,
    avatar?: File | null,
}


export interface ExistUserData {
    walletAddress: string;
    name: string;
    surname: string;
    email: string;
    alias: string;
    avatar?: string;
}