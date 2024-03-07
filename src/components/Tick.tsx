'use client';

import { useQuery } from '@apollo/client';
import { BigNumber } from 'ethers';
import type { TabsRef } from 'flowbite-react';
import { Tabs } from 'flowbite-react';
import Image from 'next/image';
import WETH_IMAGE from 'public/weth.webp';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Address } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

import type { Pool } from '@/@types/interfaces';
import PoolABI from '@/abis/Pool.json';

import { GET_TICK_DETAIL } from '../apollo/queries';
import { formatTokenAmount } from '../helpers';
import { SpotlightCard } from './Spotlight';
import TxForm from './TxForm';

interface TickDetailProps {
  poolID: Address;
  pool: Pool;
  tickID: string;
  tokenSymbol: string;
  deposits: string;
}

const TickDetail: React.FC<TickDetailProps> = ({ poolID, pool, tickID, tokenSymbol, deposits }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [approveAmount, setApproveAmount] = useState<string>('0');
  const tabsRef = useRef<TabsRef>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const { address, isConnected } = useAccount();
  const { data } = useQuery(GET_TICK_DETAIL, {
    variables: { id: tickID },
  });

  const { data: depositsData, refetch }: { data: BigNumber[] | undefined; refetch: () => void } =
    useReadContract({
      address: poolID,
      abi: PoolABI,
      functionName: 'deposits',
      args: [address, data?.tick?.raw],
    });

  const myTotalDeposits = useMemo(() => {
    if (!depositsData) return '0';

    return depositsData
      .reduce((total, current) => total.add(current), BigNumber.from(0))
      .toString();
  }, [depositsData]);

  useEffect(() => {
    setApproveAmount('0');
  }, [activeTab, open]);

  if (!data) return null;

  return (
    <>
      <SpotlightCard onClick={() => setOpen(true)}>
        <div className="flex items-center gap-4 justify-between bg-brand-primary/20 p-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold whitespace-nowrap">
              {data?.tick?.token?.symbol || 'WETH'}
            </p>
          </div>
          <div className="absolute top-1.5 right-1.5 flex justify-between items-center w-fit border border-slate-700 px-2 py-1 bg-brand-primary/20 border-brand-primary rounded-md ml-auto">
            <p className="text-gray-100 font-semibold text-sm whitespace-nowrap">
              {data.tick.duration / 60 / 60 / 24} d
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4">
          {/* <p className="text-sm text-gray-400">
            Current APR: {calculateAPR()} %
          </p> */}
          <p className="text-sm text-gray-400">
            Loan Limit: {formatTokenAmount(data.tick.limit)} {tokenSymbol}
          </p>
          <p className="text-sm text-gray-400">
            Deposits: {formatTokenAmount(deposits)} {tokenSymbol}
          </p>
        </div>
      </SpotlightCard>
      {open && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex justify-center md:items-center items-end">
          <div
            className="fixed z-10 inset-0 overflow-y-auto bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="flex flex-col bg-black border-brand-primary/30 min-h-[425px] z-50 p-8 rounded-t-lg border-t md:border md:rounded-lg w-full md:w-[90%] md:max-w-[600px] h-auto">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src={WETH_IMAGE}
                alt={data?.tick?.token?.symbol || `Tick #${data.tick.raw.slice(-6)}`}
                className="w-8 h-8"
                width={32}
                height={32}
              />
              <span>{data?.tick?.token?.symbol || `Tick #${data.tick.raw.slice(-6)}`}</span>
            </div>

            <Tabs
              style="underline"
              ref={tabsRef}
              className="flex flex-1 gap-2 border-b-0 flex-nowrap"
              onActiveTabChange={(tab) => setActiveTab(tab)}
              theme={{
                tablist: {
                  base: '!flex-none',
                  tabitem: {
                    base: 'flex items-center justify-center p-4 text-base font-bold first:ml-0 hover:!text-brand-primary/60 rounded-t-lg border-b-2 !text-brand-primary/40 w-[50%]',
                    styles: {
                      underline: {
                        active: {
                          on: 'bg-brand-primary/20 rounded-md text-brand-primary border-b-0',
                          off: 'text-gray-500 border-b-2 border-transparent',
                        },
                      },
                    },
                  },
                },
                tabitemcontainer: {
                  base: 'flex-1',
                  styles: {
                    underline: 'flex',
                  },
                },
                tabpanel: 'flex-1 tabPanel',
              }}
            >
              <Tabs.Item title="Mint" className="flex-1">
                <TxForm
                  type="deposit"
                  tick={data.tick}
                  amount={approveAmount}
                  poolID={poolID}
                  currencyID={pool.currencyToken.id as unknown as Address}
                  tokenSymbol={tokenSymbol}
                  setAmount={setApproveAmount}
                  refetch={refetch}
                />
              </Tabs.Item>
              <Tabs.Item title="Redeem" className="flex-1">
                <div className="flex flex-col gap-4 w-full">
                  {isConnected && (
                    <div className="flex flex-col gap-2 bg-brand-primary/20 p-4 rounded-lg">
                      <label className="text-xs text-gray-400">
                        You have up to{' '}
                        <b className="text-white">
                          {formatTokenAmount(myTotalDeposits.toString())} {tokenSymbol}{' '}
                        </b>
                        to redeem
                      </label>
                    </div>
                  )}
                  <TxForm
                    type="redeem"
                    tick={data.tick}
                    amount={approveAmount}
                    poolID={poolID}
                    currencyID={pool.currencyToken.id as unknown as Address}
                    tokenSymbol={tokenSymbol}
                    redeemLimit={myTotalDeposits.toString()}
                    setAmount={setApproveAmount}
                    refetch={refetch}
                  />
                </div>
              </Tabs.Item>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
};

export default TickDetail;
