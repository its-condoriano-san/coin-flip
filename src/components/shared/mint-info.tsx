import { Game } from '@/assets/icons';
import { Chip } from '@/assets/images';
import React from 'react';
import { Typography } from '../ui/typography';
import { Button } from '../ui/button';
import { useAleoWallet } from '@/hooks/useAleoWallet';

const MintInformation = () => {
  return (
    <div className="flex h-fit flex-col gap-6 rounded-lg bg-[#1D1B49] p-8">
      <div className="inline-flex items-center gap-3">
        <Typography variant={'subtitle-lg'}>
          Unlock Free Play with CHIP!
        </Typography>
        <img src={Chip} className="w-10" alt="play-icon" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-span-4 rounded-lg border border-[#ECD96F] p-10">
          <Typography>
            Mint CHIP and start playing your favorite games for free! With CHIP,
            you can try out Coinflip, Lottery, and more without spending ALEO.
            Just connect your wallet, cover a small gas fee, and get ready to
            play.
          </Typography>
        </div>
        {/* <div className="col-span-1">
          <Button
            variant={'secondary'}
            className="h-20 w-full text-ellipsis whitespace-nowrap p-10 text-[18px] "
          >
            Connect Wallet to Mint CHIP
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default MintInformation;
