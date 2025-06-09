"use client"

import React, { JSX, useState } from "react";
import { BalanceData, ChainName, NativeName, TokenName } from "../types/backendTypes";
import Image from "next/image";
import { CHAIN_ICONS_MAP, TOKEN_ICONS_MAP } from "../constants";

export type TokenDataProps = {
    icon: string,
    tokenName: TokenName | NativeName
    totalAmount: number,
    price: number,
    balanceData: BalanceData
}

export function Token({ tokenData, currencySymbol }: { tokenData: TokenDataProps, currencySymbol: string }): JSX.Element {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full border bg-gray-50 rounded-lg mt-4 shadow-sm w-full font-normal text-base">

      <div className="flex p-3 px-6 relative">
        <div className="flex justify-between w-full ">
          
          <div className="flex w-1/3 justify-center relative items-center">
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="absolute left-0 top-1/2 -translate-y-1/2"
            >
              <Image
                src={'/play-button.svg'} // убери `..` — пути всегда абсолютные в next/image
                alt="toggle"
                width={14}
                height={14}
                className={`transition-transform duration-300 ${
                  expanded ? "rotate-90" : ""
                }`}
              />
            </button>

            <Image
              src={tokenData.icon}
              alt={tokenData.tokenName}
              width={20}
              height={20}
              className="rounded-full object-contain ml-5 mr-2"
            />
            {tokenData.tokenName}
          </div>

          <div className="w-1/4 text-center">{tokenData.price}{currencySymbol}</div>
          <div className="w-1/4 text-center">{tokenData.totalAmount}</div>
          <div className="w-1/4 text-center">
            {(Number(tokenData.totalAmount) * Number(tokenData.price)).toFixed(2)}{currencySymbol}
          </div>
        </div>
      </div>

        {/* Раскрывающийся блок */}
        <div className={`transition-all duration-300 overflow-hidden ${expanded ?
          "max-h-40 opacity-100" : 
          "max-h-0 opacity-0"}`}>
          <hr className="border-t border-gray-300" />
          <div className="py-3">
            
            {Object.keys(tokenData.balanceData).map((el: string, index: number) => {
              let chainName = el as ChainName
              if(Number(tokenData.balanceData[chainName]) > 0) {
                return(
                  <div key={index} className="flex p-3 px-6 relative">
                    <div className="flex justify-between w-full ">
                      
                      <div className="flex w-1/3 justify-center relative items-center">
                        <Image
                          src={CHAIN_ICONS_MAP[chainName]}
                          alt={CHAIN_ICONS_MAP[chainName]}
                          width={20}
                          height={20}
                          className="rounded-full object-contain ml-5 mr-2"
                        />
                        {chainName}

                      </div>
                      
                      <div className="w-1/4 text-center">{tokenData.price}</div>
                      <div className="w-1/4 text-center">{Number(tokenData.balanceData[chainName]).toFixed(2)}</div>
                      <div className="w-1/4 text-center">{(Number(tokenData.balanceData[chainName]) * tokenData.price).toFixed(2)}</div>

                    </div>
                  </div>
                )
              }

            })}

          </div>
        </div>
    </div>
  );
}