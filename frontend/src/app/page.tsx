"use client"

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { ConnectButton } from './components/connectButton';
import { handleSearch } from './components/scripts';

export default function Home() {
  
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
    
    <header className="w-full flex justify-end items-center px-8 py-6 fixed top-0 left-0 right-0 z-50">
        <ConnectButton classNameProps="min-w-[200px]"/>
    </header>

    <div className="min-h-screen flex flex-col items-center justify-start pt-[30vh]">
      <div className="text-4xl font-semibold mb-6 text-center">
        Отслеживайте ваши активы тут
      </div>

      <div className="relative w-[63ch]">
        <input
          type="text"
          placeholder="Введите адрес кошелька"
          className="border border-gray-300 rounded-xl px-6 py-4 w-full text-xl
          shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
          ref={inputRef}
        />
        <button
          onClick={() => {handleSearch(router, inputRef.current?.value)}}
          className="absolute right-4 top-1/2 transform -translate-y-1/2
          text-gray-500 hover:text-blue-600 cursor-pointer"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
    </div>
    </>
  );
}
