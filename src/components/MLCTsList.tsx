'use client';

import { useQuery } from '@apollo/client';
import { BigNumber } from 'ethers';
import Image from 'next/image';
import WETH_IMAGE from 'public/weth.webp';
import React, { useEffect, useState } from 'react';
import { Commet } from 'react-loading-indicators';
import type { Address } from 'viem';

import type { Deposit, Pool, Tick } from '@/@types/interfaces';
import client from '@/apollo/apollo-clients';
import { formatTokenAmount } from '@/helpers';

import { GET_POOL_DETAIL, GET_POOLS, GET_TICKS_FROM_POOL } from '../apollo/queries';
import Spotlight from './Spotlight';
import TickDetail from './Tick';

interface PoolDeatils {
  poolID: Address;
  pool: Pool;
  ticks: Tick[];
  collateralToken: string;
}

const MLCTsList: React.FC = () => {
  const { loading: poolsLoading, error: poolsError, data: poolsData } = useQuery(GET_POOLS);
  const [poolDetails, setPoolDetails] = useState<PoolDeatils[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPoolDetails = async () => {
      if (!poolsData || poolsData.pools.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const fetchedPoolDetails =
        poolsData.pools.map(async (pool: Pool) => {
          const poolDetailResponse = await client.query({
            query: GET_POOL_DETAIL,
            variables: { poolId: pool.id },
          });

          const ticksResponse = await client.query({
            query: GET_TICKS_FROM_POOL,
            variables: { pool: pool.id },
          });

          return {
            poolID: pool.id,
            pool: poolDetailResponse.data.pool as Pool,
            ticks: ticksResponse.data.ticks as Tick[],
            collateralToken: pool.collateralToken,
          };
        }) ?? [];

      Promise.all(fetchedPoolDetails).then((details: PoolDeatils[]) => {
        setPoolDetails(details);
        setIsLoading(false);
      });
    };

    fetchPoolDetails();
  }, [poolsData]);

  if (poolsLoading || isLoading)
    return (
      <div className="flex flex-1 flex-col gap-4 container mx-auto p-4 justify-center items-center">
        <Commet
          color="#976cff"
          size="small"
          text=""
          textColor=""
          style={{ fontSize: '10px', color: '#976cff' }}
        />
      </div>
    );
  if (poolsError) return <p>Error: {poolsError.message}</p>;
  if (poolDetails && poolDetails?.length === 0) return <p>No pools available</p>;

  return (
    <>
      {poolDetails?.map((detail) => {
        return (
          <div className="flex flex-col gap-4 container mx-auto p-4" key={detail.poolID}>
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                <span className="text-xl">{detail.pool.collateralToken.name}&nbsp;/</span>
                <div className="text-gray-400 flex gap-1 items-end">
                  <small>{detail.pool.currencyToken.symbol}</small>
                  <Image
                    src={WETH_IMAGE}
                    alt={detail.pool.currencyToken.symbol}
                    width={22}
                    height={22}
                  />
                </div>
              </div>
              <small className="block text-gray-400 text-xs">
                TVL: {formatTokenAmount(detail.pool.totalValueLocked.toString())}{' '}
                {detail.pool.currencyToken.symbol}
              </small>
            </div>
            <div className="flex bg-gray-600/15 p-4 rounded-xl justify-center items-center">
              {detail.ticks.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <span>No ticks available</span>
                </div>
              ) : (
                <Spotlight className="h-auto min-h-[50px] mx-auto grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 group">
                  {detail.ticks.map((tick: Tick) => {
                    const depositsForTick = detail.pool?.deposits.filter(
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
                      <React.Fragment key={tick.id as unknown as Address}>
                        <TickDetail
                          poolID={detail.poolID}
                          pool={detail.pool}
                          tickID={tick.id as unknown as Address}
                          tokenSymbol={detail.pool.currencyToken.symbol}
                          deposits={totalDepositedAmount.toString()}
                        />
                      </React.Fragment>
                    );
                  })}
                </Spotlight>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default MLCTsList;
