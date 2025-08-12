import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger
} from '../ui/dialog';
import { Typography } from '../ui/typography';
import { CLose } from '@/assets/icons';

type MintInfoModalProps = {
  trigger: React.ReactNode;
};

const MintInfoModal = ({ trigger }: MintInfoModalProps) => {
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="flex h-full max-h-[500px] w-full max-w-[640px] gap-8">
        <div className="relative flex flex-col justify-center space-y-[28px]">
          <DialogClose>
            <img
              src={CLose}
              alt="close-icon"
              className="absolute right-0 top-0 transition-all hover:scale-105"
            />
          </DialogClose>
        </div>

        <div className="flex flex-col space-y-4">
          <Typography
            variant="h2"
            className="text-32 mt-8 font-medium leading-6"
          >
            Mint CHIP
          </Typography>

          <Typography variant="body1" className="leading-relaxed text-gray-300">
            CHIP is the exclusive, free-to-mint token that powers your gaming
            experience on FlipIt. It’s designed to let you enjoy our games
            without needing ALEO tokens.
          </Typography>

          <div className="flex flex-col space-y-4">
            <Typography className="leading-relaxed text-gray-300">
              <strong>1. Connect Your Wallet:</strong> Click on Connect Wallet
              if you haven't already. This links your CHIP directly to your
              account, so you're ready to start playing as soon as you mint!
            </Typography>

            <Typography
              variant="body1"
              className="leading-relaxed text-gray-300"
            >
              <strong>2. Mint CHIP:</strong> Once connected, look for the Mint
              button on the Coinflip page. With a single click, you’ll mint
              CHIP, covering only the gas fees required.
            </Typography>

            <Typography
              variant="body1"
              className="leading-relaxed text-gray-300"
            >
              <strong>3. Start Playing:</strong> With CHIP in your wallet, you
              can now enjoy our games without risking ALEO. Use it across our
              games like Coinflip, Lottery, and many more to see what each game
              offers.
            </Typography>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MintInfoModal;
