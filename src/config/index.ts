import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';
import { sepolia } from 'wagmi/chains';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
  name: 'MetaStreet Challenge',
  description: 'Challenge for MetaStreet',
  url: 'https://example.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// Create wagmiConfig
export const config = defaultWagmiConfig({
  chains: [sepolia],
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
});
