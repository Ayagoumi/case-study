import { gql } from '@apollo/client';

export const GET_POOLS = gql`
  query GetPools {
    pools {
      id
      totalValueLocked
      totalValueAvailable
      totalValueUsed
      loansOriginated
    }
  }
`;

export const GET_POOL_DETAIL = gql`
  query GetPoolDetail($poolId: String!) {
    pool(id: $poolId) {
      id
      totalValueLocked
      totalValueAvailable
      totalValueUsed
      currencyToken {
        symbol
        name
        id
      }
      deposits {
        depositedAmount
        tick {
          id
        }
      }
      collateralToken {
        id
        name
      }
    }
  }
`;

export const GET_TICKS_FROM_POOL = gql`
  query GetTickFromPool($pool: String!) {
    ticks(where: { pool: $pool }) {
      id
      raw
    }
  }
`;

export const GET_TICK_DETAIL = gql`
  query GetTickDetail($id: ID!) {
    tick(id: $id) {
      id
      limit
      duration
      raw
      value
      token {
        id
        symbol
      }
    }
  }
`;
