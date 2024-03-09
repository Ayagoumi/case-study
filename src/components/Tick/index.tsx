import { Tabs } from 'flowbite-react';
import Image from 'next/image';
import WETH_IMAGE from 'public/weth.webp';
import React, { useEffect, useState } from 'react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

import Modal from '@/components/Modal';
import useDeposits from '@/hooks/useDeposits';
import useTickDetail from '@/hooks/useTickDetail';

import { formatTokenAmount } from '../../helpers';
import { SpotlightCard } from '../Spotlight';
import TxForm from '../TxForm';
import LoadingTick from './LoadingTick';
import TickTabs from './TickTabs';

interface TickDetailProps {
  poolID: Address;
  currencyTokenID: Address;
  currencyTokenSymbol: string;
  tickID: string;
  deposits: string;
}

const TickDetail: React.FC<TickDetailProps> = ({
  poolID,
  currencyTokenID,
  currencyTokenSymbol,
  tickID,
  deposits,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [approveAmount, setApproveAmount] = useState<string>('0');
  const [activeTab, setActiveTab] = useState<number>(0);
  const { address, isConnected } = useAccount();
  const { tickDetail, loading } = useTickDetail(tickID);
  const { depositsData: totalDeposits } = useDeposits(poolID, address, tickDetail?.raw);

  useEffect(() => {
    setApproveAmount('0');
  }, [activeTab, open]);

  if (loading) return <LoadingTick />;

  return (
    <>
      <SpotlightCard onClick={() => setOpen(true)}>
        <div className="flex items-center gap-4 justify-between bg-brand-primary/20 p-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold whitespace-nowrap">
              {tickDetail?.token?.symbol || `Tick #${tickDetail.id.slice(-4)}`}
            </p>
          </div>
          {tickDetail?.duration && (
            <div className="absolute top-1.5 right-1.5 flex justify-between items-center w-fit border border-slate-700 px-2 py-1 bg-brand-primary/20 border-brand-primary rounded-md ml-auto">
              <p className="text-gray-100 font-semibold text-sm whitespace-nowrap">
                {tickDetail.duration / 60 / 60 / 24} d
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 p-4">
          {/* <p className="text-sm text-gray-400">
            Current APR: {calculateAPR()} %
          </p> */}
          <p className="text-sm text-gray-400">
            Loan Limit: {formatTokenAmount(tickDetail.limit)} {currencyTokenSymbol}
          </p>
          <p className="text-sm text-gray-400">
            Deposits: {formatTokenAmount(deposits)} {currencyTokenSymbol}
          </p>
        </div>
      </SpotlightCard>
      {open && (
        <Modal setClose={() => setOpen(false)}>
          <div className="flex items-center gap-2 mb-4">
            <Image
              src={WETH_IMAGE}
              alt={tickDetail?.token?.symbol || `Tick #${tickDetail.id.slice(-4)}`}
              className="w-8 h-8"
              width={32}
              height={32}
            />
            <span>{tickDetail?.token?.symbol || `Tick #${tickDetail.id.slice(-4)}`}</span>
          </div>

          <TickTabs setActiveTab={setActiveTab}>
            <Tabs.Item title="Mint" className="flex-1">
              <TxForm
                type="deposit"
                poolID={poolID}
                currencyID={currencyTokenID}
                tokenSymbol={currencyTokenSymbol}
                raw={tickDetail.raw}
                limit={tickDetail.limit}
                duration={tickDetail.duration}
                amount={approveAmount}
                setAmount={setApproveAmount}
              />
            </Tabs.Item>
            <Tabs.Item title="Redeem" className="flex-1">
              <div className="flex flex-col gap-4 w-full">
                {isConnected && (
                  <div className="flex flex-col gap-2 bg-brand-primary/20 p-4 rounded-lg">
                    <label className="text-xs text-gray-400">
                      You have up to{' '}
                      <b className="text-white">
                        {formatTokenAmount(totalDeposits)} {currencyTokenSymbol}{' '}
                      </b>
                      to redeem
                    </label>
                  </div>
                )}
                <TxForm
                  type="redeem"
                  poolID={poolID}
                  currencyID={currencyTokenID}
                  tokenSymbol={currencyTokenSymbol}
                  raw={tickDetail.raw}
                  limit={tickDetail.limit}
                  duration={tickDetail.duration}
                  amount={approveAmount}
                  redeemLimit={totalDeposits}
                  setAmount={setApproveAmount}
                />
              </div>
            </Tabs.Item>
          </TickTabs>
        </Modal>
      )}
    </>
  );
};

export default TickDetail;
