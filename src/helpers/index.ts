import { ethers } from 'ethers';
import type { Address } from 'viem';

const truncateAddress = (address: Address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatTokenAmount = (amount: ethers.BigNumberish | undefined) => {
  if (!amount) return '0';

  const formattedAmount = ethers.utils.formatUnits(amount, 18);

  const match = formattedAmount.match(/^(\d+)(\.\d{1,3}[1-9])?/);

  if (match) {
    const wholePart = match[1];
    const decimalPart = match[2] ? match[2].replace(/0+$/, '') : '';
    return `${wholePart}${decimalPart}`;
  }

  return '0';
};

const BNtoDay = (bn: BigInt | undefined) => {
  if (!bn) return 0;

  const BNDay = 60 * 60 * 24;

  return Number(bn) / BNDay;
};

export { BNtoDay, formatTokenAmount, truncateAddress };
