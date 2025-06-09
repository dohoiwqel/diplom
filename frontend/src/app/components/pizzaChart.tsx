import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import Image from "next/image";
import { CHAIN_COLOR_MAP, TOKEN_ICONS_MAP } from '../constants';
import { ChainName, NativeName, TokenName } from '../types/backendTypes';
import { useEffect, useState } from 'react';

export type PizzaChartProps = 
        Array<
            {name: ChainName, value: number, tokens: 
            {name: TokenName | NativeName, value: number}[]
        }>


export function PizzaChart({ dataProps, totalValue, currencySymbol }: { dataProps: PizzaChartProps, totalValue: string, currencySymbol: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div style={{ width: '100%', height: 270 }}>
      <ResponsiveContainer>
        <PieChart>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={30}
            fontWeight={700}
            fill="#374151" // Tailwind text-gray-700
            >
            {`${currencySymbol}${totalValue}`}
          </text>
          <Pie
            data={dataProps}
            outerRadius="100%"
            innerRadius="76%"
            dataKey="value"
            stroke="#f3f4f6"
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-out"
            onMouseEnter={(_, index) => {
              if (Number(totalValue) !== 0) setActiveIndex(index);
            }}
            onMouseLeave={() => {
              if (Number(totalValue) !== 0) setActiveIndex(null);
            }}
          >
          {dataProps.map((entry, index) => {
              const isActive = index === activeIndex;

              return (
                <Cell
                  key={index}
                  fill={Number(totalValue) === 0 
                    ? '#d1d5db' // серый цвет
                    : CHAIN_COLOR_MAP[entry.name as ChainName]
                  }
                  style={{
                    transform: Number(totalValue) === 0
                      ? 'scale(1)'
                      : isActive ? 'scale(1.01)' : 'scale(1)',
                    transformOrigin: 'center',
                    filter: Number(totalValue) === 0
                      ? 'none'
                      : !isActive && activeIndex !== null
                        ? 'blur(1.2px)' : 'none',
                    opacity: Number(totalValue) === 0
                      ? 0.6
                      : !isActive && activeIndex !== null
                        ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                  }}
                />
              );
          })}
          </Pie>

          {!(totalValue==='0.00')? 
            <Tooltip
              content={({ payload }) =>
                payload?.length ? (
                  <div className='bg-white p-2 rounded shadow min-h-[5vh]'>
                    <div className="flex gap-6 font-bold">
                      {payload[0].name}
                      <div>
                        {payload[0].payload.tokens?.map((el: any, index: number) => (
                          <div key={index} className='flex mb-3 font-normal gap-1'>
                            <Image
                              src={TOKEN_ICONS_MAP[el.name as TokenName]}
                              alt={el.name}
                              width={22}
                              height={22}
                              className="rounded-full object-contain"
                            />
                            {Number(el.value).toFixed(5)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <hr className="border-t border-gray-300" />
                    <div className="flex items-center justify-center font-semibold text-lg">
                      {Number(payload[0].value).toFixed(2)}$
                    </div>
                  </div>
                ) : null
              }
            />
            :<></>
          }
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}