import { useEffect, useState } from "react";
import { getAuthMessage, verifySignature } from "../scripts/backendAPI";
import { useRouter } from 'next/navigation';
import { ethers } from "ethers";
import { handleSearch } from "./scripts";

export function ConnectButton(
    {classNameProps, setWalletAddressCallback}: {
      classNameProps?: string, 
      setWalletAddressCallback?: React.Dispatch<React.SetStateAction<string>>
    }
  ) {

  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    
    if(savedAddress) {
      setWalletAddress(savedAddress)

      if(setWalletAddressCallback) {
        setWalletAddressCallback(savedAddress)
      }

      setIsConnected(true);
    }

  }, [])

  useEffect(() => {
    setShowMenu(false)
  }, [isConnected])

  async function connectWallet() {
    //@ts-ignore
    if (!window.ethereum) {
      alert('MetaMask не установлен!');
      return;
    }

    try {
      //@ts-ignore
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const address = accounts[0]

      const message = await getAuthMessage(address)
      //@ts-ignore
      const signer = new ethers.BrowserProvider(window.ethereum).getSigner();
      const signature = await (await signer).signMessage(message)

      const verifyResponse = await verifySignature(address, signature, message)
      console.log(verifyResponse)

      if (verifyResponse) {
        setWalletAddress(address);
        setIsConnected(true);
        if(setWalletAddressCallback) {
          setWalletAddressCallback(address)
        }
        localStorage.setItem('walletAddress', address);
        console.log('Подключено:', address);

      } else {
        console.error('Ошибка верификации');
      }

    } catch (error) {
      console.error('Ошибка подключения к кошельку:', error);
    }
  
  }

  function disconnectWallet() {
    setWalletAddress('')
    setIsConnected(false)
    if(setWalletAddressCallback) {
      setWalletAddressCallback('')
    }
    localStorage.setItem('walletAddress', '');
  }

  return (
    <div className={`relative ${classNameProps}`}>
      
      <button
        className="text-3xl bg-blue-600 border border-gray-300 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition cursor-pointer w-full shadow-md"
        onClick={isConnected ? () => setShowMenu((prev) => !prev) : connectWallet}
      >
        {isConnected ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Подключение кошелька'}
      </button>

      {/* Падающее меню */}
      {isConnected && (
        <div
          className={`absolute left-0 w-full overflow-hidden transition-all duration-300 ease-out ${
            showMenu ? 'max-h-40 opacity-100 translate-y-2' : 'max-h-0 opacity-0 translate-y-0'
          }`}
        >
          <button
            className="bg-blue-600 hover:bg-blue-700 rounded-xl text-white py-2 cursor-pointer text-center w-full"
            onClick={() => handleSearch(router, walletAddress)}
          >
            Профиль
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 rounded-xl text-white py-2 mt-2 cursor-pointer text-center w-full"
            onClick={() => {disconnectWallet()}}
          >
            Отключить
          </button>
        </div>
      )}
    </div>
  )

}