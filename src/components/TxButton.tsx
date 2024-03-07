import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Commet } from 'react-loading-indicators';
import type { Address } from 'viem';
import { erc20Abi } from 'viem';
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import type { Tick } from '@/@types/interfaces';
import PoolABI from '@/abis/Pool.json';
import { DUMMY_WETH_TOKEN_ADDRESS } from '@/constants';

interface TxButtonProps {
  amount: string;
  buttonText?: string;
  actionType: 'deposit' | 'redeem';
  tick: Partial<Tick>;
  poolID: Address;
  currencyID: Address;
  refetch: () => void;
  setAmount: (amount: string) => void;
}

const TxButton: React.FC<TxButtonProps> = ({
  amount,
  buttonText,
  actionType,
  tick,
  poolID,
  currencyID,
  refetch,
  setAmount,
}) => {
  const { address, isConnected } = useAccount();
  const [buttonState, setButtonState] = useState({
    showApprove: false,
    isDisabled: true,
    buttonText: '',
  });

  const {
    data: hash,
    error: txError,
    writeContract,
    writeContractAsync,
    isError,
    isPending,
  } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
  const { data: allowance, refetch: refreshAllowance } = useReadContract({
    address: DUMMY_WETH_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address as Address, poolID],
  });

  const shouldApprove = () => {
    if (actionType !== 'deposit' || Number.isNaN(parseFloat(amount))) return false;
    const depositAmountBN = BigInt(parseFloat(amount) * 1e18);
    return !allowance || allowance < depositAmountBN;
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      refreshAllowance();
    }
  }, [isSuccess, refetch, refreshAllowance]);

  useEffect(() => {
    const isDisabled = !isConnected || !amount || parseFloat(amount) <= 0;
    const buttonTextToShow = buttonText || actionType.charAt(0).toUpperCase() + actionType.slice(1);
    const shouldShowApprove = shouldApprove();

    setButtonState((prevState) => ({
      ...prevState,
      isDisabled,
      buttonText: shouldShowApprove ? 'Approve' : buttonTextToShow,
      showApprove: shouldShowApprove,
    }));
  }, [isConnected, amount, actionType, buttonText, allowance, isSuccess]);

  const approve = async () => {
    const depositAmountBN = BigInt(parseFloat(amount) * 1e18);
    await writeContractAsync({
      address: currencyID,
      abi: erc20Abi,
      functionName: 'approve',
      args: [poolID, depositAmountBN],
    });
  };

  const deposit = async () => {
    const depositAmountWei = ethers.utils.parseEther(amount);
    writeContract({
      address: poolID,
      abi: PoolABI,
      functionName: 'deposit',
      args: [tick.raw, depositAmountWei, 0],
    });
  };

  const redeem = async () => {
    const depositAmountWei = ethers.utils.parseEther(amount);
    writeContract({
      address: poolID,
      abi: PoolABI,
      functionName: 'redeem',
      args: [tick.raw, depositAmountWei],
    });
  };

  const handleButtonClick = () => {
    if (buttonState.showApprove) approve();
    else if (actionType === 'deposit') deposit();
    else if (actionType === 'redeem') redeem();
  };

  useEffect(() => {
    setAmount('0');
  }, [isSuccess]);

  return (
    <>
      <button
        onClick={handleButtonClick}
        disabled={buttonState.isDisabled}
        className={`mt-auto bg-brand-primary/70 text-white rounded-md p-2 w-full ${buttonState.isDisabled ? 'disabled:opacity-20' : ''}`}
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
      {txError && (
        <div className="text-red-500 mt-3 text-center w-full">
          Something went wrong: {txError.name}
        </div>
      )}
    </>
  );
};

export default TxButton;
