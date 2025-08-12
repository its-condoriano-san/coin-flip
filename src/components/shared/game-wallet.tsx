import { PrivateAvatar, PublicAvatar } from '@/assets/icons';
import { Button } from '../ui/button';
import ProfilePopover from './profile-popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  useSelectedToken,
  useTokens
} from '@/providers/TokensProvider/tokens.hooks';
import { convertBigIntValueToNormal } from '@/utils/conversion';
import CountUp from 'react-countup';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  ALEO_TOKENS,
  getTokenDetail,
  SupportedTokens,
  TOKEN_CONFIG
} from '@/configs/token';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { GameTokenType, useGameSetting } from '@/providers/GameSettingProvider';
import { ValueOf } from 'type-fest';

type GamewalletProps = {
  isPrivate?: boolean;
  className?: string;
  isClaimable?: boolean;
  claimableBalance?: Partial<Record<SupportedTokens, bigint>>;
  prevClaimableBalance?: number;
  prevBalance?: number;
  claim?: () => Promise<void>;
  supportedTokens?: ValueOf<typeof ALEO_TOKENS>[];
  headerDisabled?: boolean;
  infoClick?: () => void;
};

const Gamewallet = ({
  isPrivate = true,
  isClaimable,
  claimableBalance,
  prevClaimableBalance,
  claim,
  className,
  supportedTokens,
  headerDisabled,
  infoClick
}: GamewalletProps) => {
  const { setSelectedToken, selectedToken } = useTokens();
  const token = useSelectedToken();
  const { setTokenType } = useGameSetting();

  const tokenClaimBalance = claimableBalance?.[token?.symbol];

  return (
    <div
      aria-disabled={headerDisabled}
      className={` ${className}  relative flex justify-between gap-[20px] rounded-full bg-[#2B295F]/30  py-[6px] pl-[12px] pr-[12px] md:py-[12px] md:pl-[24px] md:pr-[16px] ${headerDisabled ? 'pointer-events-none opacity-50' : ''}`}
    >
      {isClaimable && (
        <div className="flex items-center gap-3">
          <img
            src={TOKEN_CONFIG[selectedToken].logo}
            alt={TOKEN_CONFIG[selectedToken].name}
          />
          <CountUp
            className={` ${+convertBigIntValueToNormal(tokenClaimBalance, token?.decimals) > 0 ? 'w-[40px]' : ''}  font-semibold text-[#92819F]`}
            start={prevClaimableBalance}
            end={
              +convertBigIntValueToNormal(tokenClaimBalance, token?.decimals)
            }
          />
          {tokenClaimBalance > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant={'secondary'} onClick={() => claim?.()}>
                    Claim
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Claim your winnings directly to your wallet after each game!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Popover>
            <PopoverTrigger>
              <ChevronDownIcon />
            </PopoverTrigger>
            <PopoverContent
              className="rounded-mg mt-4 w-[150px] space-y-6 bg-[#1D1B49]"
              align={'end'}
            >
              <div className="hover:bsg-[#0000] flex flex-col items-center ">
                {supportedTokens?.map((t, index) => {
                  const tokenDetail = getTokenDetail(t);
                  const isAleoToken = tokenDetail.symbol === 'Aleo';
                  console.log(isAleoToken, 'is aleo token');
                  return (
                    <div
                      style={{ display: 'flex' }}
                      className={`w-full cursor-pointer p-3 hover:bg-accent ${isAleoToken ? 'pointer-events-none opacity-50' : ''}`}
                      onClick={(e) => {
                        if (isAleoToken) {
                          e.stopPropagation();
                          return;
                        }
                        setSelectedToken(tokenDetail.symbol as SupportedTokens);
                        setTokenType(
                          tokenDetail.isNative
                            ? GameTokenType.NATIVE
                            : GameTokenType.TOKEN
                        );
                      }}
                      key={index}
                    >
                      <img
                        src={tokenDetail.logo}
                        alt={tokenDetail.name}
                        className="mr-2"
                      />
                      <p key={index}>
                        {tokenDetail.name} -{' '}
                        {convertBigIntValueToNormal(
                          claimableBalance?.[t] ? claimableBalance?.[t] : 0n
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
      <Wallet
        balanceDetails={{ balance: token?.balance, decimals: token?.decimals }}
        headerDisabled={headerDisabled}
        infoClick={infoClick}
        isClaimable={isClaimable}
      />
      <ProfilePopover
        trigger={<img src={isPrivate ? PrivateAvatar : PublicAvatar} alt="" />}
      />
    </div>
  );
};

type WalletProps = {
  balanceDetails: { balance: bigint; decimals: number };
  headerDisabled?: boolean;
  infoClick?: () => void;
  isClaimable?: boolean;
};

const Wallet = ({
  balanceDetails,
  headerDisabled,
  infoClick,
  isClaimable
}: WalletProps) => {
  const { setTokenType } = useGameSetting();
  const balance = +convertBigIntValueToNormal(
    balanceDetails.balance,
    balanceDetails.decimals
  );
  const {
    getBalance,
    setSelectedToken,
    selectedToken,
    mintChipToken,
    prevBalance
  } = useTokens();

  console.log(prevBalance, balance, 'balance prev');

  return (
    <>
      <div className="flex items-center gap-3" aria-disabled={headerDisabled}>
        <Popover>
          <PopoverTrigger>
            <div className="flex cursor-pointer items-center gap-3">
              <img
                src={TOKEN_CONFIG[selectedToken].logo}
                alt={TOKEN_CONFIG[selectedToken].name}
              />
              <CountUp
                className={` ${balance > 0 ? 'w-[60px]' : ''} font-semibold text-[#92819F]`}
                start={prevBalance}
                end={balance}
                decimals={3}
                key={balance}
              />

              <ChevronDownIcon />
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="rounded-mg mt-4 w-[150px] space-y-6 bg-[#1D1B49]"
            align={'end'}
          >
            <div className="hover:bsg-[#0000] flex flex-col items-center ">
              {Object.entries(TOKEN_CONFIG).map(([key, token], index) => {
                const isAleoToken = token.name === 'Aleo';
                return (
                  <div
                    style={{ display: 'flex' }}
                    className={`flex w-full cursor-pointer p-3 hover:bg-accent ${isAleoToken ? 'pointer-events-none opacity-50' : ''}`}
                    onClick={(e) => {
                      if (isAleoToken) {
                        e.stopPropagation(); // Prevent the click event if it’s Aleo
                        console.log('returned');
                        return;
                      }
                      console.log('clicked');
                      setSelectedToken(token.symbol as SupportedTokens);
                      setTokenType(
                        token.isNative
                          ? GameTokenType.NATIVE
                          : GameTokenType.TOKEN
                      );
                    }}
                    key={index}
                  >
                    <img src={token.logo} alt={token.name} className="mr-2" />
                    <p key={index}>
                      {token.name} -{' '}
                      {convertBigIntValueToNormal(
                        getBalance(key as SupportedTokens)
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
        {/* {selectedToken === ALEO_TOKENS.CHIP && isClaimable && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={'secondary'} onClick={mintChipToken}>
                    Mint
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    You can mint CHIP to play games for free! Cover a small gas
                    fee and mint 50 CHIP!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <button onClick={infoClick}>?</button>
          </>
        )} */}
      </div>
    </>
  );
};

export default Gamewallet;
