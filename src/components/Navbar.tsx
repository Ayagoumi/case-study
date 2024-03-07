'use client';

import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import Image from 'next/image';
import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

import ConnectButton from '@/components/ConnectButton';
import { truncateAddress } from '@/helpers';

const Navbar: React.FC = () => {
  const { connect, connectors } = useConnect();
  const { address, isConnecting, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { open: modalOpen } = useWeb3ModalState();

  const openModal = () => {
    try {
      open();
      if (!address && connectors.length > 0 && connectors[0]) {
        connect({ connector: connectors[0] });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error opening modal:', error);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 text-white border-b border-gray-100/30">
      <Image src="/logo.svg" alt="MetaStreet" width={40} height={40} />
      <div className="flex items-center gap-4">
        {address && (
          <span className="font-medium hidden sm:block text-gray-300">
            {truncateAddress(address)}
          </span>
        )}
        <ConnectButton
          isConnecting={isConnecting}
          isConnected={isConnected}
          modalOpen={modalOpen}
          openModal={openModal}
          disconnect={disconnect}
        />
      </div>
    </nav>
  );
};

export default Navbar;
