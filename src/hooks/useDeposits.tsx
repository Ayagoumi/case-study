import type { Bytes } from 'ethers';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import type { Address } from 'viem';
import { useReadContract } from 'wagmi';

import PoolABI from '@/abis/Pool.json';

const useDeposits = (poolID: Address, address: Address | undefined, raw: Bytes) => {
  const { data, refetch }: { data: BigNumber[] | undefined; refetch: () => void } = useReadContract(
    {
      address: poolID,
      abi: PoolABI,
      functionName: 'deposits',
      args: [address, raw],
    },
  );

  const myTotalDeposits: string = useMemo(() => {
    if (!data) return '0';

    return data.reduce((total, current) => total.add(current), BigNumber.from(0)).toString();
  }, [data]);

  return {
    depositsData: myTotalDeposits || '0',
    refetch,
  };
};

export default useDeposits;
