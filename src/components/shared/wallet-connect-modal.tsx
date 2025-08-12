import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger
} from '../ui/dialog';
import { Typography } from '../ui/typography';
import { Aleo, CLose, Wallet } from '@/assets/icons';
import { useAleoWallet } from '@/hooks/useAleoWallet';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { X } from 'lucide-react';

type WalletConnectModalProps = {
  trigger: React.ReactNode;
};

const WalletConnectModal = ({ trigger }: WalletConnectModalProps) => {
  const { connect } = useAleoWallet();
  const { wallets } = useWallet();
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="flex h-full max-h-[470px] w-full max-w-[640px] gap-8">
        <div className="w-full max-w-[250px] space-y-[28px] rounded-md bg-[#060634] p-6">
          <div className="inline-flex gap-3">
            <Typography variant={'title-sm'}>Connect Wallet</Typography>
            <img src={Wallet} alt="wallet-icon" />
          </div>
          {wallets.map((wallet, index) => {
            return (
              <button
                key={index}
                className="flex w-full items-center gap-2 rounded-xs bg-[#1D1B49] p-2"
                onClick={() => connect(wallet.adapter.name)}
              >
                <img className="h-6 w-6" src={wallet.adapter.icon} />

                <div className="flex flex-col gap-1">
                  <p className="font-dm-sans text-[14px] font-medium leading-[18.23px]">
                    {wallet.adapter.name}{' '}
                    {wallet.readyState !== 'Installed' ? '(Not Installed)' : ''}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="relative flex flex-col justify-center space-y-[28px]">
          <DialogClose>
            <X className="absolute right-0 top-0 transition-all hover:scale-105" />
          </DialogClose>
          <Typography as={'h2'} className="font-medium leading-[20.16px]">
            What is a Wallet?
          </Typography>
          <div className="flex flex-col gap-2">
            <Typography variant={'body-sm'}>Easy Login</Typography>
            <Typography variant={'body-xs'}>
              No need to create new account and passwords for every website.
              Just connect your wallet and get going.
            </Typography>
          </div>
          <div className="flex flex-col gap-2">
            <Typography variant={'body-sm'}>
              Store your Digital Assets
            </Typography>
            <Typography variant={'body-xs'}>
              No need to create new account and passwords for every website.
              Just connect your wallet and get going.
            </Typography>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectModal;
