import type { Address } from 'viem';

const truncateAddress = (address: Address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
export { truncateAddress };
