'use client';

import { BigNumber } from 'ethers';
import Image from 'next/image';
import WETH_IMAGE from 'public/weth.webp';
import { Fragment } from 'react';

import type { Deposit, Tick } from '@/@types/interfaces';
import { formatTokenAmount } from '@/helpers';
import usePoolDetails from '@/hooks/usePoolDetails';

import Spotlight from '../Spotlight';
import TickDetail from '../Tick';
import Empty from './Empty';
import ErrorMLCTs from './ErrorMLCTs';
import LoadingMLCTs from './LoadingMLCTs';

const MLCTsList: React.FC = () => {
  const { poolDetails, loading, error } = usePoolDetails();

  if (loading) return <LoadingMLCTs />;

  if (error)
    return <ErrorMLCTs message={error.message || 'An error occurred while fetching pools'} />;

  if (!poolDetails) return <Empty />;

  return (
    <Fragment>
      {poolDetails?.map((poolDetail) => {
        return (
          <div className="flex flex-col gap-4 container mx-auto p-4" key={poolDetail.id}>
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                <span className="text-xl">{poolDetail.collateralToken.name}&nbsp;/</span>
                <div className="text-gray-400 flex gap-1 items-end">
                  <small>{poolDetail.currencyToken.symbol}</small>
                  <Image
                    src={WETH_IMAGE}
                    alt={poolDetail.currencyToken.symbol}
                    width={22}
                    height={22}
                  />
                </div>
              </div>
              <small className="block text-gray-400 text-xs">
                TVL: {formatTokenAmount(poolDetail.totalValueLocked.toString())}{' '}
                {poolDetail.currencyToken.symbol}
              </small>
            </div>
            <div className="flex bg-gray-600/15 p-4 rounded-xl justify-center items-center">
              {poolDetail.ticks.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <span>No ticks available</span>
                </div>
              ) : (
                <Spotlight className="h-auto min-h-[50px] mx-auto grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 group">
                  {poolDetail.ticks.map((tick: Tick) => {
                    const depositsForTick = poolDetail.deposits.filter(
                      (deposit: Deposit) => deposit.tick.id === tick.id,
                    );

                    const totalDepositedAmount = depositsForTick.reduce(
                      (total: BigNumber, deposit: Deposit) => {
                        const depositAmount = BigNumber.from(deposit.depositedAmount);
                        return total.add(depositAmount);
                      },
                      BigNumber.from(0),
                    );
                    return (
                      <Fragment key={tick.id}>
                        <TickDetail
                          poolID={poolDetail.id}
                          tickID={tick.id}
                          currencyTokenID={poolDetail.currencyToken.id}
                          currencyTokenSymbol={poolDetail.currencyToken.symbol}
                          deposits={totalDepositedAmount.toString()}
                        />
                      </Fragment>
                    );
                  })}
                </Spotlight>
              )}
            </div>
          </div>
        );
      })}
    </Fragment>
  );
};

export default MLCTsList;
