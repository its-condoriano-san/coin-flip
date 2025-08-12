import {
  DecryptPermission,
  WalletAdapterNetwork,
  WalletName,
  WalletNotConnectedError
} from '@demox-labs/aleo-wallet-adapter-base';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';

import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { VITE_NETWORK_TYPE } from '@/configs/env';
export const useAleoWallet = () => {
  const aleoWalletConfig = useWallet();

  const connect = async (wallet: WalletName<string>) => {
    try {
      if (aleoWalletConfig.connected)
        return await aleoWalletConfig.disconnect();
      aleoWalletConfig.select(wallet);
      aleoWalletConfig.connect(
        DecryptPermission.OnChainHistory,
        VITE_NETWORK_TYPE == 'mainnet'
          ? WalletAdapterNetwork.MainnetBeta
          : WalletAdapterNetwork.TestnetBeta
      );
    } catch (e) {
      console.error(e);
    }
  };

  const reset = () => {
    aleoWalletConfig.disconnect();
    toast.success('Disconnected successfully');
  };

  useEffect(() => {
    if (!aleoWalletConfig.wallet) return;
    aleoWalletConfig.connect(
      DecryptPermission.OnChainHistory,
      WalletAdapterNetwork.MainnetBeta
    );
  }, [aleoWalletConfig]);

  const programRecords = async (program: string, onlyUnspent: boolean) => {
    console.log(aleoWalletConfig);
    if (!aleoWalletConfig.publicKey) throw new WalletNotConnectedError();
    console.log(aleoWalletConfig.publicKey, 'wallet');

    let records = await aleoWalletConfig.requestRecords!(program);
    records = records.filter((r) => (onlyUnspent ? !r.spent : true));
    console.log(records, 'records');
    return records;
  };
  return {
    ...aleoWalletConfig,
    connect,
    programRecords,
    reset
  };
};
