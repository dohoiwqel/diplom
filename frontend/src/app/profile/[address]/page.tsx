"use client"

import { BACKEND_URL, CHAIN_ICONS_MAP, TOKEN_ICONS_MAP, TOKEN_PRICE_MAP } from "@/app/constants";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getHistory, getPrices, getTotalBalance, getUserByWalletAddress } from "@/app/scripts/backendAPI";
import { TokenName, NativeName, ChainName, PriceData, TokenTransferResponse, TokenTransfer, ExplorerTokenTransfer, ExistUserData } from "@/app/types/backendTypes";
import { ChainBalance, TotalBalanceResponse } from "@/app/types/types";
import { calculateChainBalance, calculateTotalValueUSD } from "@/app/scripts/scripts";
import { PizzaChart, PizzaChartProps } from "@/app/components/pizzaChart";
import CountUp from 'react-countup';
import { motion, AnimatePresence } from "framer-motion";
import { Token } from "@/app/components/token";
import { NavbarProfile } from "@/app/components/navbarProfile";
import { Passport } from "@/app/components/passport";
import { TransactionHistory } from "@/app/components/TransactionHistory";

function getPizzaChartProps(chainBalance: ChainBalance): PizzaChartProps {

    let pizzaChartProps: PizzaChartProps = []

    for(let cName in chainBalance) {
        const chainName = cName as ChainName

        let tokenArr: {name: TokenName | NativeName, value: number}[] = []
        for(let tName in chainBalance[chainName].balanceData) {
            const tokenName = tName as TokenName | NativeName
            tokenArr.push({
                name: tokenName,
                value: chainBalance[chainName].balanceData[tokenName]
            })
        }

        pizzaChartProps.push(
            {name: chainName, value: chainBalance[chainName].totalValueUSD, tokens: tokenArr}
        )
    }

    return pizzaChartProps
}

const Profile = () => {

    const params = useParams();
    const address = params.address as string;

    const [totalBalance, setTotalBalance] = useState<TotalBalanceResponse | null>(null)
    const [chainBalance, setChainBalance] = useState<ChainBalance | null>(null)
    const [totalValue, setTotalValue] = useState<number | null>(null)
    const [readyToAnimate, setReadyToAnimate] = useState(false);
    const [priceData, setPriceData] = useState<PriceData | null>(null)
    const [currency, setCurrency] = useState<'USD' | 'RUB'>('USD');
    const [usdPrice, setUsdPrice] = useState(0)
    const [tokenOrHistory, setTokenOrHistory] = useState<"TOKEN" | "HISTORY">('TOKEN')
    const [transferHistory, setTransferHistory] = useState<ExplorerTokenTransfer[] | null>(null)
    const [walletAddress, setWalletAddressCallback] = useState<string>('')
    const [userData, setUserData] = useState<ExistUserData | null>(null)

    useEffect(() => {
        (async () => {
            const response = await getTotalBalance(address)

            if(response) {
                setTotalBalance(response)
                const chainBalance = await calculateChainBalance(response)
                setChainBalance(chainBalance)
                setTotalValue(calculateTotalValueUSD(chainBalance))
            }

        })()
    }, [address]);

    useEffect(() => {
        (async () => {
            const history = await getHistory(address)
            if(history) {
                setTransferHistory(history)
            }

            const responseUserData = await getUserByWalletAddress(address)
            
            if(responseUserData) {
                setUserData(responseUserData)
            } else {
                setUserData(null)
            }

        })()
    }, [address]);

    useEffect(() => {
        if (chainBalance) {
            const timeout = setTimeout(() => setReadyToAnimate(true), 50);
            return () => clearTimeout(timeout);
        }
    }, [chainBalance]);

    useEffect(() => {
        (async () => {
            const priceData = await getPrices()
            setPriceData(priceData)
            setUsdPrice(Number(priceData['tether'].rub))
        })()
    }, [])

    const chains = [
        { name: "BNB Chain", 
            balance: chainBalance?
                currency==='USD'?
                    chainBalance.BSC.totalValueUSD:
                    chainBalance.BSC.totalValueUSD*usdPrice
            :0,
                icon: CHAIN_ICONS_MAP.BSC 
        },
        { name: "Optimism", 
            balance: chainBalance?
                currency==='USD'?
                    chainBalance.OPTIMISM.totalValueUSD:
                    chainBalance.OPTIMISM.totalValueUSD*usdPrice
            :0,
                icon: CHAIN_ICONS_MAP.OPTIMISM 
        },
        { name: "Arbitrum", 
            balance: chainBalance?
                currency==='USD'?
                    chainBalance.ARBITRUM.totalValueUSD:
                    chainBalance.ARBITRUM.totalValueUSD*usdPrice
            :0,
                icon: CHAIN_ICONS_MAP.ARBITRUM 
        },
    ].sort((a, b) => b.balance - a.balance)


    return (
        <>
        <NavbarProfile setWalletAddressCallback={setWalletAddressCallback} currency={currency} setCurrency={setCurrency}/>

        <div className="min-h-screen pt-[11vh] px-8">

            <div className="min-h-[320px] flex gap-4 mx-[22vw] mt-[6vh]">
                <div className="basis-2/3 bg-white rounded-xl shadow-lg p-6">

                    <div className="flex items-center justify-between space-x-8">
                        
                        <div className="flex items-center space-x-4">
                            <Image
                                src={userData? `${BACKEND_URL}${userData.avatar}`: "/profile-placeholder.png"}
                                alt="Profile"
                                width={120}
                                height={120}
                                className="rounded-full"
                            />
                            <div className="flex flex-col space-y-2">
                                <div className="flex gap-2 text-2xl font-bold">
                                    {userData? userData.alias: "Неизвестный пользователь"}
                                    {
                                        address.toLowerCase()===walletAddress.toLowerCase() && userData !== undefined?
                                            userData?
                                                <Passport setUserData={setUserData} userData={userData} walletAddress={address}/>
                                            :   <Passport setUserData={setUserData} userData={null} walletAddress={address}/>
                                        :
                                        <></>
                                    }
                                </div>
                                <div className="text-gray-500 text-xl">{address}</div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-6">
                        <div className="flex">
                            <h3 className="text-xl font-semibold mb-2 pl-3">Сети</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <AnimatePresence>
                                {chains.map((chain) => (
                                    <motion.div
                                        key={chain.name}
                                        className="flex items-center p-3 bg-gray-50 rounded-lg border"

                                        layout
                                        initial={{ opacity: 0, y: 1 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -100 }}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                    >
                                        <Image
                                            src={chain.icon}
                                            alt={chain.name}
                                            width={38}
                                            height={38}
                                            className="mr-3 rounded-full"
                                        />
                                        <div>
                                            <p className="font-medium text-lg">{chain.name}</p>
                                            <p className="text-gray-500 text-lg">{currency==='USD'?'$':'₽'}<CountUp end={chain.balance} duration={2.5} separator="," decimals={2} /></p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                    
                </div>
                
                <div className="basis-1/3 bg-white rounded-xl shadow-lg p-6">
                    {chainBalance && readyToAnimate && totalValue!==null && (
                        <PizzaChart 
                            currencySymbol={currency==="USD"? '$': '₽'} 
                            totalValue={currency==='USD'?totalValue.toFixed(2):(totalValue*usdPrice).toFixed(2)} 
                            key={address} 
                            dataProps={getPizzaChartProps(chainBalance)} 
                        />
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg mx-[22vw] p-6 mt-4 ">
                <div className="flex gap-4 text-xl font-semibold pl-3 mb-4">
                    <h1
                        onClick={() => setTokenOrHistory('TOKEN')}
                        className={`cursor-pointer hover:text-blue-600 transition ${
                            tokenOrHistory === 'TOKEN' ? 'border-b-2 border-grey-300' : ''
                        }`}
                    >
                        Активы
                    </h1>
                    <span>|</span>
                    <h1
                        onClick={() => setTokenOrHistory('HISTORY')}
                        className={`cursor-pointer hover:text-blue-600 transition ${
                            tokenOrHistory === 'HISTORY' ? 'border-b-2 border-grey-300' : ''
                        }`}
                    >
                        История
                    </h1>
                </div>

                {tokenOrHistory==='TOKEN'?
                    <>
                    <div className="flex justify-between px-6 py-3 border-b text-xs text-gray-500 font-semibold uppercase ">
                        <div className="w-1/3 text-center">Актив</div>
                        <div className="w-1/4 text-center">Цена</div>
                        <div className="w-1/4 text-center">Баланс</div>
                        <div className="w-1/4 text-center">Value</div>
                    </div>

                    {   
                        totalBalance && priceData? 
                        Object.keys(totalBalance).map((tName, index) => {
                            const tokenName = tName as TokenName | NativeName
                            return(
                                totalBalance[tokenName].totalValue?
                                    <Token
                                        key={index}
                                        tokenData={{
                                            icon: TOKEN_ICONS_MAP[tokenName],
                                            tokenName: tokenName,
                                            totalAmount: totalBalance[tokenName].totalValue,
                                            price: currency==='USD'? Number( priceData[TOKEN_PRICE_MAP[tokenName]].usd): Number(priceData[TOKEN_PRICE_MAP[tokenName]].rub),
                                            balanceData: totalBalance[tokenName].balanceData
                                        }}
                                        currencySymbol={currency==='USD'? '$': '₽'}
                                    />
                                : <React.Fragment key={index} />
                            )
                        })
                        : <></>
                    }
                    </>
                    :
                    transferHistory? 
                        <TransactionHistory address={address} transactions={transferHistory} />
                    :
                    <></>
                }
            </div>

        </div>
        </>
  );
}

export default Profile