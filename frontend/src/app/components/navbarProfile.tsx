import { useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ConnectButton } from './connectButton';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { isAddress } from 'ethers';
import { getUserByAlias } from '../scripts/backendAPI';
import { handleSearch } from './scripts';

export function NavbarProfile(
    {currency, setCurrency, setWalletAddressCallback}: {
      currency: string, 
      setCurrency: React.Dispatch<React.SetStateAction<"USD" | "RUB">>
      setWalletAddressCallback: React.Dispatch<React.SetStateAction<string>>
    }
  ) {

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter()

  return (
    <header
      className="w-full flex justify-end items-start py-6 fixed top-0 left-0 right-0 z-50 gap-4"
      style={{ paddingLeft: 'calc(22vw + 2rem)', paddingRight: 'calc(22vw + 2rem)' }}
    >
      <div className="relative">
        <input
          type="text"
          placeholder="Введите адрес"
          className="border border-gray-300 rounded-xl px-4 pr-11 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          ref={inputRef}
        />
        <button
          onClick={() => handleSearch(router, inputRef.current?.value)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 cursor-pointer"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>

      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as 'USD' | 'RUB')}
        className="border border-gray-300 rounded-xl px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="USD">USD</option>
        <option value="RUB">RUB</option>
      </select>

      <ConnectButton setWalletAddressCallback={setWalletAddressCallback}/>
    </header>
  );
}
