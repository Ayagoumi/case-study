import { ethers } from 'ethers';
import type { Address } from 'viem';

const truncateAddress = (address: Address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatTokenAmount = (amount: ethers.BigNumberish | undefined) => {
  if (!amount) return '0';

  const formattedAmount = ethers.utils.formatUnits(amount, 18);

  const match = formattedAmount.match(/^(\d+)(\.\d{0,3})?/);

  return match ? `${match[1]}${match[2] || ''}` : '0';
};

const BNtoDay = (bn: BigInt | undefined) => {
  if (!bn) return 0;

  const BNDay = 60 * 60 * 24;

  return Number(bn) / BNDay;
};

// eslint-disable-next-line import/prefer-default-export
export { BNtoDay, formatTokenAmount, truncateAddress };
