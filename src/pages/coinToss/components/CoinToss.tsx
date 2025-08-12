import { useState } from 'react';

import { tCoinflipSupportedTokens } from '@/configs/cointoss';
import { useAleoWallet } from '@/hooks/useAleoWallet';
import { useThrottle } from '@/hooks/useThrottle';
import { useCoinToss } from '@/providers/coinTossProvider';
import { useTokens } from '@/providers/TokensProvider/tokens.hooks';
import { sleep } from '@/utils/sleep';
import CoinTossController from './CoinTossController';
import CoinTossPlayground from './CoinTossPlayground';

const CoinToss = () => {
  const [showPlayAgainBtn, setShowPlayAgainBtn] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [betSuccess, setBetSuccess] = useState<boolean>(false);
  const { connected } = useAleoWallet();
  const { claimableBalance, prevClaimableBalance, claim, headerDisabled } =
    useCoinToss();

  const {
    gameState,
    reveal,
    setTriggerAnimation,
    setHeaderDisabled,
    refreshClaimableBalance,
    setResetCount,
    setGameState
  } = useCoinToss();
  const { betCount, revealCount } = gameState;
  const { selectedToken } = useTokens();

  const { throttledFunc: throttledReveal } = useThrottle(async () => {
    await reveal();
    setTriggerAnimation(true);

    if (betCount === revealCount + 1) {
      setShowPlayAgainBtn(true);
      setHeaderDisabled(false);
      await sleep(3000);
      refreshClaimableBalance([selectedToken as tCoinflipSupportedTokens]);
      console.log({ betCount, revealCount });
    }

    // await sleep(3000);
  }, 500);
  const handleReveal = () => {
    if (betCount - revealCount < 0) return;
    throttledReveal();
  };

  const handlePlayAgain = async () => {
    setIsDisabled(true);

    setResetCount((prev) => prev + 1);
    setShowPlayAgainBtn(false);
    setHeaderDisabled(false);
    setBetSuccess(false);
    setGameState((prev) => ({
      ...prev,
      results: [],
      wonAmt: 0,
      revealCount: 0
    }));
    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  };

  return (
    <div className="mb-8 w-full space-y-4 lg:space-y-8">
      <div className="flex w-full flex-col items-center gap-8 rounded-lg bg-[#1D1B49] px-[24px] py-[48px]">
        <CoinTossPlayground
          data={{
            showPlayAgainBtn,
            setShowPlayAgainBtn,
            handleReveal,
            handlePlayAgain,
            isDisabled,
            setIsDisabled,
            setBetSuccess,
            betSuccess
          }}
        />
        <CoinTossController
          data={{
            showPlayAgainBtn,
            setShowPlayAgainBtn,
            handleReveal,
            handlePlayAgain,
            isDisabled,
            setIsDisabled,
            setBetSuccess,
            betSuccess
          }}
        />
      </div>
    </div>
  );
};

export default CoinToss;
