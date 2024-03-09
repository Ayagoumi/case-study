import { type Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

import { DUMMY_WETH_TOKEN_ADDRESS } from '@/constants';

const useAllowance = (poolID: Address, address: Address | undefined) => {
  const { data, refetch } = useReadContract({
    address: DUMMY_WETH_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address as Address, poolID],
  });

  return {
    allowance: data,
    refreshAllowance: refetch,
  };
};

export default useAllowance;
