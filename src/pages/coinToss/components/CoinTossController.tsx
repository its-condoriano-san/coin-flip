import { useEffect, useState } from 'react';

import { Aleo, Minus, Plus, Reset } from '@/assets/icons';
import { CoinHeads, CoinTails } from '@/assets/images';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useCoinToss } from '@/providers/coinTossProvider';
import { useGameSetting } from '@/providers/GameSettingProvider';
import { useTokens } from '@/providers/TokensProvider/tokens.hooks';
import { sleep } from '@/utils/sleep';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import IncreasingNumberAnimation from './IncreasingNumberAnimation';

const MAX_BETS = 5;
const wagerList = [1, 5, 10, 20];
const coinSide = [
  {
    name: 'Heads',
    value: true,
    image: CoinHeads
  },
  {
    name: 'Tails',
    value: false,
    image: CoinTails
  }
];

const CoinTossController = ({ data }) => {
  const { setHeaderDisabled } = useCoinToss();
  const [selectedWager, setSelectedWager] = useState<number>(0);

  const { selectedToken } = useTokens();

  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    if (showComponent) {
      const timer = setTimeout(() => {
        setShowComponent(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showComponent]);

  // const [error, setError] = React.useState('Not enough ALEO in your wallet');

  const { tokenType } = useGameSetting();
  const {
    gameState,
    maxWager,
    handleStateChange,
    bet,
    resetGame,
    totalBet,
    resetCount,
    setResetCount
  } = useCoinToss();

  const { wager, betCount, selectedSide, revealCount } = gameState;

  // console.log(betCount, 'betcount ');

  const tokenMaxWager =
    maxWager?.[tokenType] === undefined ? 25 : maxWager?.[tokenType];

  const updateWager = (newWager: number) => {
    if (!tokenMaxWager) return;
    if (newWager > tokenMaxWager) newWager = tokenMaxWager;
    handleStateChange({ wager: newWager });
  };

  const updateBetCount = (newBetCount: number) => {
    handleStateChange({ betCount: newBetCount });
  };

  const updateCoinside = (selectedSide: boolean) => {
    handleStateChange({ selectedSide });
  };

  const handleBet = async (onSuccess: () => void) => {
    if (isNaN(wager) || wager <= 0) {
      toast.error('Wager must be greater than 0');
      return;
    }

    await bet(onSuccess, () => {});
    await sleep(3000);
  };

  // const { throttledFunc: throttledReveal } = useThrottle(async () => {
  //   await reveal();
  //   setTriggerAnimation(true);
  //   playSound(CoinFlip);

  //   if (betCount === revealCount + 1) {
  //     data.setShowPlayAgainBtn(true);
  //     setHeaderDisabled(false);
  //     await sleep(3000);
  //     refreshClaimableBalance([selectedToken as tCoinflipSupportedTokens]);
  //     console.log({ betCount, revealCount });
  //   }

  //   // await sleep(3000);
  // }, 500);

  // const handleReveal = () => {
  //   if (betCount - revealCount < 0) return;
  //   throttledReveal();
  // };

  // const handlePlayAgain = async () => {
  //   playSound(ButtonClick);
  //   setIsDisabled(true);

  //   setResetCount((prev) => prev + 1);
  //   data.setShowPlayAgainBtn(false);
  //   setHeaderDisabled(false);
  //   setBetSuccess(false);
  //   setGameState((prev) => ({
  //     ...prev,
  //     results: [],
  //     wonAmt: 0,
  //     revealCount: 0
  //   }));
  //   setTimeout(() => {
  //     setIsDisabled(false);
  //   }, 2000);
  // };

  // console.log(
  //   'max wager',
  //   tokenType,

  //   tokenMaxWager
  // );
  // console.log(data.betSuccess, 'betsuccess');

  return (
    <div className="flex w-2/3 flex-col gap-8 rounded-lg">
      <div
        className={clsx('flex flex w-full items-center gap-8', {
          'pointer-events-none blur': data.betSuccess
        })}
      >
        <div className={clsx('gameplay-section flex w-full flex-col gap-8')}>
          <div className="w-full space-y-4">
            <span>Number of Bets</span>
            <div className="flex flex-col gap-3 rounded-md bg-[#262458] px-[12px] py-[8px] ">
              <span className="text-[24px] font-medium leading-[30.24px]">
                {betCount} Bet
              </span>
              <Slider
                key={resetCount}
                defaultValue={[betCount]}
                max={MAX_BETS}
                min={1}
                onValueChange={(e) => updateBetCount(e[0])}
              />
              <span className="text-[12px] leading-[15.12px] text-white/30">
                Maximum # of Bets is {MAX_BETS}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2">
            <span>Choose Wager</span>

            <div className="flex flex-wrap justify-center gap-2 rounded-sm">
              {wagerList.map((wag) => {
                return (
                  <div className="relative flex ">
                    {/* {!(wager > tokenMaxWager) && selectedWager === wag && (
                        <IncreasingNumberAnimation
                          className={`${selectedWager === wag && !(wager > tokenMaxWager) && 'increasing-number'}`}
                          value={wag}
                          key={wager}
                          isVisible={showComponent && selectedWager === wag}
                        />
                      )} */}
                    <IncreasingNumberAnimation
                      isVisible={showComponent && selectedWager === wag}
                      value={wag}
                    />
                    <button
                      onClick={() => {
                        updateWager(wager + wag);
                        setSelectedWager(wag);
                        setShowComponent(true);
                      }}
                      disabled={wager >= tokenMaxWager}
                      className={clsx(
                        ' aspect-square w-10  rounded-sm bg-[#4844B0] disabled:cursor-not-allowed'
                      )}
                      key={wag}
                    >
                      {wag}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* //coin faces */}
        <div className="flex w-full justify-center gap-6">
          {coinSide.map((coin, index) => (
            <button
              key={index}
              onClick={() => {
                updateCoinside(coin.value);
              }}
              className={clsx(
                'flex aspect-square w-full flex-col items-center gap-1 rounded-sm bg-[#211F50] p-[12px]',
                { 'bg-[#47438F]': selectedSide === coin.value }
              )}
            >
              <img src={coin.image} alt="coin-head" />
              <span className="font-medium leading-[20.16px]">{coin.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        {!data.betSuccess ? (
          <>
            <Button
              variant={'secondary'}
              className="w-full p-3 text-[20px] font-semibold leading-[25.2px]  disabled:bg-[#f490f6]"
              onClick={() => {
                handleBet(() => {
                  data.setIsDisabled(true);
                  data.setBetSuccess(true);
                  setTimeout(() => {
                    data.setIsDisabled(false);
                  }, 2000);
                  setHeaderDisabled(true);
                });
              }}
              disabled={data.isDisabled}
            >
              Place Bet ({totalBet}&nbsp;
              {selectedToken === 'Chip' ? (
                <div className="text-lg"> CHIP</div>
              ) : (
                <div className="text-lg"> ALEO</div>
              )}
              )
            </Button>

            <Button
              variant={'tertiary'}
              size={'icon'}
              className="h-full p-3"
              onClick={() => {
                resetGame();
                setResetCount((prev) => prev + 1);
              }}
            >
              <img src={Reset} alt="reset" className=" h-[32px] w-[32px]" />
            </Button>
          </>
        ) : (
          <Button
            variant={'secondary'}
            className="hidden w-full p-3 text-[20px] font-semibold  leading-[25.2px] disabled:bg-[#f490f6] sm:block"
            onClick={
              data.showPlayAgainBtn ? data.handlePlayAgain : data.handleReveal
            }
            disabled={data.isDisabled}
          >
            {data.showPlayAgainBtn
              ? 'Play Again'
              : `Flip Now (${betCount - revealCount})`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CoinTossController;
