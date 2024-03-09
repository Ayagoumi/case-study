import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

import type { Pool } from '@/@types/interfaces';
import client from '@/apollo/apollo-clients';

import { GET_POOL_DETAIL, GET_POOLS, GET_TICKS_FROM_POOL } from '../apollo/queries';

interface PoolDetails extends Pool {
  ticks: [];
}

const usePoolDetails = () => {
  const { loading: poolsLoading, error, data } = useQuery(GET_POOLS);
  const [poolDetails, setPoolDetails] = useState<PoolDetails[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(true);

  useEffect(() => {
    const fetchPoolDetails = async () => {
      if (!data || !data.pools || data.pools.length === 0) {
        setDetailsLoading(false);
        return;
      }

      setDetailsLoading(true);
      const promises = data.pools.map(async (pool: Pool) => {
        const poolDetailResponse = await client.query({
          query: GET_POOL_DETAIL,
          variables: { poolId: pool.id },
        });

        const ticksResponse = await client.query({
          query: GET_TICKS_FROM_POOL,
          variables: { pool: pool.id },
        });

        return {
          ...poolDetailResponse.data.pool,
          ticks: ticksResponse.data.ticks,
        };
      });

      const details = await Promise.all(promises);
      setPoolDetails(details);
      setDetailsLoading(false);
    };

    if (!poolsLoading) fetchPoolDetails();
  }, [poolsLoading, data]);

  const loading = poolsLoading || detailsLoading;

  return { poolDetails, loading, error };
};

export default usePoolDetails;
