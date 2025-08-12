import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Button } from '../ui/button';
import { useTokens } from '@/providers/TokensProvider/tokens.hooks';

const MintButton = () => {
  const { mintChipToken } = useTokens();
  return (
    <div className="flex flex-row gap-5">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={'secondary'} onClick={mintChipToken}>
              Mint
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              You can mint CHIP to play games for free! Cover a small gas fee
              and mint 50 CHIP!
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <button>?</button>
    </div>
  );
};

export default MintButton;
