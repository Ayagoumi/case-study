import { ethers } from 'ethers';
const truncateAddress = (address: Address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
export { truncateAddress };
