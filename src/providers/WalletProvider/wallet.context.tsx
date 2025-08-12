import { COINFLIP_TOKEN_PROGRAM, VITE_NETWORK_TYPE } from '@/configs/env';
import { walletAdapterNetwork } from '@/configs/walletAdapter';
import {
  DecryptPermission,
  WalletAdapterNetwork
} from '@demox-labs/aleo-wallet-adapter-base';
import { WalletProvider as AleoWalletProvider } from '@demox-labs/aleo-wallet-adapter-react';
import { LeoWalletAdapter, PuzzleWalletAdapter } from 'aleo-adapters';
import { FC, ReactNode, useEffect, useMemo } from 'react';

interface IWalletsProviderProps {
  children: ReactNode;
}

export const WalletProviders: FC<IWalletsProviderProps> = ({ children }) => {
  const appName = 'Arcade POC';
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: 'Aleo app'
      }),
      new PuzzleWalletAdapter({
        programIdPermissions: {
          [WalletAdapterNetwork.MainnetBeta]: [
            COINFLIP_TOKEN_PROGRAM,
            'dApp_1_import.aleo',
            'dApp_1_import_2.aleo'
          ],
          [WalletAdapterNetwork.TestnetBeta]: [
            COINFLIP_TOKEN_PROGRAM,
            'dApp_1_test_import.aleo',
            'dApp_1_test_import_2.aleo'
          ]
        },
        appName: 'Aleo app',
        appDescription: 'A privacy-focused DeFi app',
        appIconUrl: ''
      })
    ],
    []
  );

  return (
    <AleoWalletProvider
      wallets={wallets}
      decryptPermission={DecryptPermission.OnChainHistory}
      network={walletAdapterNetwork}
      autoConnect
    >
      {children}
    </AleoWalletProvider>
  );
};
