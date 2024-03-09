import type { Bytes } from 'ethers';
import { useMemo } from 'react';
import type { Address } from 'viem';
import { useAccount, useBalance } from 'wagmi';

import { BNtoDay, formatTokenAmount } from '@/helpers';

import TxButton from './TxButton';

interface TxFormProps {
  type: 'deposit' | 'redeem';
  raw: Bytes;
  limit: BigInt;
  duration: BigInt;
  amount: string;
  tokenSymbol: string;
  redeemLimit?: string;
  poolID: Address;
  currencyID: Address;
  setAmount: (amount: string) => void;
}

const TxForm = ({
  type,
  raw,
  limit,
  duration,
  amount,
  tokenSymbol,
  redeemLimit,
  poolID,
  currencyID,
  setAmount,
}: TxFormProps) => {
  const { address, isConnected } = useAccount();
  const { data, isLoading, error } = useBalance({
    address,
    token: currencyID,
  });

  const balanceDisplay = useMemo(() => {
    if (isLoading || error) return `0 ${tokenSymbol}`;
    return `${formatTokenAmount(data?.value)} ${data?.symbol}`;
  }, [isLoading, error, data]);

  const maxAmount = useMemo(() => {
    return type === 'deposit'
      ? parseFloat(balanceDisplay || '0')
      : parseFloat(formatTokenAmount(redeemLimit) || '0');
  }, [data, type, redeemLimit]);

  const disabledInput = () => {
    if (type === 'deposit' && data?.value) {
      return !isConnected || data?.value < BigInt(0);
    }
    if (type === 'redeem' && maxAmount > 0) {
      return !isConnected;
    }
    return true;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputAmount = parseFloat(e.target.value);
    if (!Number.isNaN(inputAmount) && inputAmount <= maxAmount) {
      setAmount(e.target.value);
    } else if (inputAmount > maxAmount) {
      setAmount(maxAmount.toString());
    }
  };

  return (
    <div className="flex flex-col gap-4 flex-1 mt-2 w-full">
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-400">
          {type === 'deposit' ? 'Deposit' : 'Redeem'} Amount :
        </label>
        <div
          className={`flex items-center gap-2 drop-shadow-sm transition-all duration-200 ease-in-out bg-gray-800/50 h-12 p-4 rounded-lg ${disabledInput() ? 'opacity-50' : ''}`}
        >
          <button
            type="button"
            onClick={() => setAmount(maxAmount.toString())}
            className="text-xs text-gray-400"
          >
            Max
          </button>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={handleAmountChange}
            className="peer h-10 w-full rounded-md px-4 outline-none bg-transparent text-end"
            min="0"
            max={maxAmount.toString()}
            disabled={disabledInput()}
          />
          <label className="text-xs text-gray-400">{tokenSymbol}</label>
        </div>
      </div>

      {type === 'deposit' && (
        <>
          <p className="flex text-xs text-gray-400 justify-between">
            <label className="text-xs text-gray-400">Loan Limit: </label>
            <span>
              {formatTokenAmount(limit?.toString())} {tokenSymbol}
            </span>
          </p>
          <p className="flex text-xs text-gray-400 justify-between">
            <label className="text-xs text-gray-400">Max Loan Term: </label>
            <span>{BNtoDay(duration)} d</span>
          </p>
          {isConnected && (
            <p className="flex text-xs text-gray-400 justify-between">
              <label className="text-xs text-gray-400">Balance:</label>
              <span>{balanceDisplay}</span>
            </p>
          )}
        </>
      )}

      <TxButton
        amount={amount}
        buttonText={type === 'deposit' ? 'Mint' : 'Redeem'}
        actionType={type}
        raw={raw}
        poolID={poolID}
        currencyID={currencyID}
        setAmount={setAmount}
      />
      {!isConnected && (
        <p className="text-xs text-gray-400 text-center text-red-500">
          Connect your wallet to continue
        </p>
      )}
    </div>
  );
};

export default TxForm;
