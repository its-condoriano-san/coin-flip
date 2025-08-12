import { CoinHeads, CoinTails } from '@/assets/images';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { useCoinToss } from '@/providers/coinTossProvider';
import CountUp from 'react-countup';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { useTokens } from '@/providers/TokensProvider/tokens.hooks';
import { playSound } from '@/utils/audio';
import { ALEO_TOKENS, TOKEN_CONFIG } from '@/configs/token';

const CoinAnimation = () => {
  const [flipResult, setFlipResult] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const { gameState, triggerAnimation, setTriggerAnimation } = useCoinToss();

  const { results, revealCount } = gameState;

  const triggerAnimate = async () => {
    setAnimationKey((prevKey) => prevKey + 1);
    // document.getElementById('coin')?.removeAttribute('class');
    setFlipResult(''); // Clear previous result to reset the animation

    console.log(
      results,
      revealCount,
      results[revealCount - 1],
      'results, revealcount,results[-1'
    );
    setFlipResult(results[revealCount - 1] === true ? 'heads' : 'tails');

    setTriggerAnimation(false);
  };

  useEffect(() => {
    if (!triggerAnimation) return;

    triggerAnimate();
  }, [triggerAnimation]);

  return (
    <div
      id="coin"
      key={animationKey}
      className={`${flipResult} -mt-10 aspect-square w-full min-w-[180px] max-w-[320px]`} // Apply the class based on flipResult
    >
      <div className="side-a"></div>
      <div className="side-b"></div>
    </div>
  );
};

const CoinTossPlayground = ({ data }) => {
  const { gameState, prevWonAmt, totalBet } = useCoinToss();
  const { revealCount, wonAmt, betCount } = gameState;
  const [showResult, setShowResult] = useState(false);
  const { selectedToken } = useTokens();

  useEffect(() => {
    if (betCount === revealCount) {
      const timer = setTimeout(() => {
        setShowResult(true);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShowResult(false);
    }
  }, [betCount, revealCount]);

  return (
    <div className="relative flex w-full flex-col justify-between gap-4">
      {showResult && (
        <ResultAnnouncement
          message={wonAmt > 0 ? `You've won!` : `Try Again!`}
        />
      )}
      <div className="space-y-3">
        <div className="flex flex-col items-center">
          <Typography className="text-[#92819F]" variant={'label-sm'}>
            Total Payout
          </Typography>
          <Typography
            className={clsx(
              'uppercase',
              wonAmt > 0 ? 'text-[#ECD96F]' : 'text-[#2B295F]'
            )}
            variant={'body-xl'}
          >
            {' '}
            <CountUp
              start={prevWonAmt}
              end={wonAmt}
              duration={1}
              prefix="+"
              suffix={
                selectedToken === 'Aleo'
                  ? ` ${TOKEN_CONFIG[ALEO_TOKENS.ALEO].symbol}`
                  : ` ${TOKEN_CONFIG[ALEO_TOKENS.CHIP].symbol}`
              }
            />
          </Typography>
        </div>

        {data.betSuccess && (
          <Button
            variant={'secondary'}
            className="w-full p-3 text-[20px] font-semibold leading-[25.2px] disabled:bg-[#f490f6]  sm:hidden"
            onClick={
              data.showPlayAgainBtn ? data.handlePlayAgain : data.handleReveal
            }
            disabled={data.isDisabled}
          >
            {data.showPlayAgainBtn
              ? 'Play Again'
              : `Flip Now (${betCount - revealCount})`}
            {/* reveal */}
          </Button>
        )}
      </div>
      <div className="flex items-center justify-around">
        <CoinAnimation />
      </div>
      <div className="flex w-full flex-col items-center justify-evenly lg:flex-row">
        <div className="text-[14px] font-medium leading-[33px] tracking-[4%] text-[#92819F]">
          Your Bet:{' '}
          <span className="text-[24px] uppercase leading-[30.24px]">
            {totalBet}{' '}
            {selectedToken === 'Aleo'
              ? TOKEN_CONFIG[ALEO_TOKENS.ALEO].symbol
              : TOKEN_CONFIG[ALEO_TOKENS.CHIP].symbol}
          </span>
        </div>
        <div className="text-[14px] font-medium leading-[33px] tracking-[4%] text-[#92819F]">
          Max Payout:{' '}
          <CountUp
            className="text-[24px] uppercase leading-[30.24px]"
            start={totalBet / 2}
            end={totalBet * 2}
            suffix={
              selectedToken === 'Aleo'
                ? ` ${TOKEN_CONFIG[ALEO_TOKENS.ALEO].symbol}`
                : ` ${TOKEN_CONFIG[ALEO_TOKENS.CHIP].symbol}`
            }
            duration={1}
          />
        </div>
      </div>
    </div>
  );
};

const ResultAnnouncement = ({ message }: { message: string }) => {
  return (
    <div className="absolute left-1/2 top-0 h-[60px] -translate-x-1/2 rounded-b-[20px] bg-[#1D1B49] px-[16px] text-center text-[24px] font-bold text-[#ECD96F] shadow-md md:px-[32px] md:text-[40px]">
      {message}
    </div>
  );
};

const CoinSequenceResult = ['heads', 'tails', 'tails', 'heads', 'tails'];

const CoinSequenceContainer = () => {
  return (
    <div className="flex w-full justify-between gap-[18px]">
      {Array.from({ length: 10 }).map((_, index) => {
        return (
          <div
            key={index}
            className={clsx('h-[60px] w-[60px] rounded-xs  bg-[#4F2D6E]', {
              '!bg-[#2B295F]': CoinSequenceResult[index]
            })}
          >
            {CoinSequenceResult[index] && (
              <img
                src={
                  CoinSequenceResult[index] === 'heads' ? CoinHeads : CoinTails
                }
                alt="coin-sides"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CoinTossPlayground;
