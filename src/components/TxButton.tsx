import type { Bytes } from 'ethers';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Commet } from 'react-loading-indicators';
import type { Address } from 'viem';
import { erc20Abi } from 'viem';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import PoolABI from '@/abis/Pool.json';
import useAllowance from '@/hooks/useAllowance';
import useDeposits from '@/hooks/useDeposits';

interface TxButtonProps {
  amount: string;
  buttonText?: string;
  actionType: 'deposit' | 'redeem';
  raw: Bytes;
  poolID: Address;
  currencyID: Address;
  setAmount: (amount: string) => void;
}

const TxButton: React.FC<TxButtonProps> = ({
  amount,
  buttonText,
  actionType,
  raw,
  poolID,
  currencyID,
  setAmount,
}) => {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [buttonState, setButtonState] = useState({
    showApprove: false,
    isDisabled: true,
    buttonText: '',
  });

  const {
    data: hash,
    error,
    writeContract,
    writeContractAsync,
    isError,
    isPending,
  } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
  const { allowance, refreshAllowance } = useAllowance(poolID, address);
  const { refetch } = useDeposits(poolID, address, raw);

  const shouldApprove = () => {
    if (actionType !== 'deposit' || Number.isNaN(parseFloat(amount))) return false;
    const depositAmountBN = BigInt(parseFloat(amount) * 1e18);
    return !allowance || allowance < depositAmountBN;
  };

  const approve = async () => {
    const depositAmountBN = BigInt(parseFloat(amount) * 1e18);
    setLoading(true);
    await writeContractAsync({
      address: currencyID,
      abi: erc20Abi,
      functionName: 'approve',
      args: [poolID, depositAmountBN],
    });
    setLoading(false);
  };

  const deposit = async () => {
    const depositAmountWei = ethers.utils.parseEther(amount);
    setLoading(true);
    writeContract({
      address: poolID,
      abi: PoolABI,
      functionName: 'deposit',
      args: [raw, depositAmountWei, 0],
    });
    setLoading(false);
  };

  const redeem = async () => {
    const depositAmountWei = ethers.utils.parseEther(amount);
    setLoading(true);
    writeContract({
      address: poolID,
      abi: PoolABI,
      functionName: 'redeem',
      args: [raw, depositAmountWei],
    });
    setLoading(false);
  };

  const handleButtonClick = () => {
    if (buttonState.showApprove) approve();
    else if (actionType === 'deposit') deposit();
    else if (actionType === 'redeem') redeem();
  };

  useEffect(() => {
    if (!shouldApprove()) setAmount('0');
    if (isSuccess) {
      refetch();
      refreshAllowance();
    }
  }, [isSuccess, refetch, refreshAllowance]);

  useEffect(() => {
    const isDisabled = loading || isLoading || !isConnected || !amount || parseFloat(amount) <= 0;
    const buttonTextToShow = buttonText || actionType.charAt(0).toUpperCase() + actionType.slice(1);
    const shouldShowApprove = shouldApprove();

    setButtonState((prevState) => ({
      ...prevState,
      isDisabled,
      buttonText: shouldShowApprove ? 'Approve' : buttonTextToShow,
      showApprove: shouldShowApprove,
    }));
  }, [loading, isLoading, isConnected, amount, actionType, buttonText, allowance, isSuccess]);

  return (
    <>
      <button
        onClick={handleButtonClick}
        disabled={buttonState.isDisabled}
        className={`mt-auto bg-brand-primary/70 text-white rounded-md p-2 w-full disabled:opacity-50`}
      >
        {(isPending || isLoading) && !isError && !isSuccess ? (
          <Commet
            color="white"
            size="small"
            text=""
            textColor=""
            style={{ fontSize: '3px', color: 'white' }}
          />
        ) : (
          buttonState.buttonText
        )}
      </button>
      {error && (
        <div className="text-red-500 mt-3 text-center w-full">
          Something went wrong: {error.message.split('.').slice(0, 1)}
        </div>
      )}
    </>
  );
};

export default TxButton;
