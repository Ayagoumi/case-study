import type { Bytes } from 'ethers';

export interface Pool {
  id: `0x${string}`;
  totalValueLocked: string;
  totalValueAvailable: string;
  totalValueUsed: string;
  loansOriginated: string;
  currencyToken: CurrencyToken;
  deposits: Deposit[];
  collateralToken: CollateralToken;
}

export interface CurrencyToken {
  id: `0x${string}`;
  name: string;
  symbol: string;
}

export interface CollateralToken {
  id: `0x${string}`;
  name: string;
}

export interface Deposit {
  depositedAmount: string;
  tick: Partial<Tick>;
}

export interface Tick {
  id: `0x${string}`;
  limit: BigInt;
  duration: BigInt;
  raw: Bytes;
  value: BigInt;
  token: Partial<CurrencyToken>;
}
