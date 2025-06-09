import Image from 'next/image';
import { ExplorerTokenTransfer } from '../types/backendTypes';
import { CHAIN_ICONS_MAP } from '../constants';

interface Props {
  address: string;
  transactions: ExplorerTokenTransfer[];
}

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function TransactionHistory({ address, transactions }: Props) {
  return (
    <div className="flex flex-col gap-4 mt-4">
      {transactions.map((tx, idx) => {
        const isIncoming = tx.to_address.toLowerCase() === address.toLowerCase();
        const date = new Date(tx.block_timestamp).toLocaleDateString();

        const from = shortenAddress(tx.from_address);
        const to = shortenAddress(tx.to_address);
        const direction = isIncoming
          ? `${from} → ${shortenAddress(address)}`
          : `${shortenAddress(address)} → ${to}`;

        return (
          <div
            key={idx}
            className="flex items-center justify-between p-4 border rounded-xl shadow-sm bg-white hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center">
              <Image
                  src={tx.token_logo}
                  alt={tx.token_symbol}
                  width={28}
                  height={28}
                  className="rounded-full shadow-md relative z-10"
              />
              <Image
                  src={CHAIN_ICONS_MAP[tx.chain]}
                  alt={tx.chain}
                  width={28}
                  height={28}
                  className="rounded-full shadow-md -ml-2 relative z-0"
              />
              </div>
              <div>
                <p className="font-medium">{tx.token_name} ({tx.token_symbol})</p>
                <p className="text-xs text-gray-500">{date}</p>
                <p className="text-sm text-gray-600">{direction}</p>
                <a
                    href={`${tx.explorer}/tx/${tx.transaction_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline break-all"
                >
                {tx.transaction_hash.slice(0, 10)}...{tx.transaction_hash.slice(-8)}
                </a>
              </div>
            </div>
            <div className={`text-lg font-semibold ${isIncoming ? 'text-green-500' : 'text-red-500'}`}>
              {isIncoming ? '+' : '-'}{parseFloat(tx.value_decimal).toFixed(4)} {tx.token_symbol}
            </div>
          </div>
        );
      })}
    </div>
  );
}
