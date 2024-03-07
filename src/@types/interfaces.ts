import type { Bytes } from 'ethers';

export interface Pool {
  id: string;
  totalValueLocked: string;
  totalValueAvailable: string;
  totalValueUsed: string;
  loansOriginated: string;
  currencyToken: CurrencyToken;
  deposits: Deposit[];
  collateralToken: CollateralToken;
}

export interface CurrencyToken {
  id: Bytes;
  name: string;
  symbol: string;
}

export interface CollateralToken {
  id: string;
  name: string;
}

export interface Deposit {
  depositedAmount: string;
  tick: Partial<Tick>;
}

export interface Tick {
  id: Bytes;
  limit: BigInt;
  duration: BigInt;
  raw: Bytes;
  value: BigInt;
  token: Partial<CurrencyToken>;
}
