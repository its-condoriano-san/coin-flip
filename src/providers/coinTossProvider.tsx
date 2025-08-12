import { js2leo, leo2js } from '@/lib/aleo';
import { LeoU64, TokenOwner } from '@/lib/aleo/types/leo-types';
import {
  convertBigIntValueToNormal,
  convertNormalToBigIntValue
} from '@/utils/conversion';
import {
  Transaction,
  WalletAdapterNetwork
} from '@demox-labs/aleo-wallet-adapter-base';
import {
  GameMode,
  GameTokenType,
  useGameSetting
} from '@/providers/GameSettingProvider';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useAleoTransaction } from '@/hooks/useAleoTransaction';
import { useAleoContract } from '@/hooks/useAleoContract';
import { VoidFn } from '@/interfaces/common';
import { useTransaction } from './TransactionProvider/transaction.provider';
import { TRANSACTION_STEPS } from '@/configs/transaction';
import { useAleoWallet } from '@/hooks/useAleoWallet';
import { toast } from 'react-toastify';
import { useSelectedToken, useTokens } from './TokensProvider/tokens.hooks';
import { getTokenDetail, SupportedTokens, TOKEN_CONFIG } from '@/configs/token';
import { hasher, hashTokenOwner } from '@/utils/hasher';
import { sleep } from '@/utils/sleep';
import {
  COINFILP_PROGRAM,
  CoinflipSupportedTokens,
  tCoinflipSupportedTokens
} from '@/configs/cointoss';
import { walletAdapterNetwork } from '@/configs/walletAdapter';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { parseJSONLikeString } from '@/utils/parser';

export type CoinflipState = {
  wager: number;
  betCount: number;
  selectedSide: boolean;
  results: boolean[];
  wonAmt: number;
  revealCount: number;
};

type ClaimBalanceRecord = Partial<Record<tCoinflipSupportedTokens, bigint>>;
type MaxWagerRecord = Partial<Record<GameTokenType, number>>;

interface ICoinTossContext {
  gameState: CoinflipState;
  headerDisabled: boolean;
  setHeaderDisabled: (boolean) => void;
  setGameState: React.Dispatch<React.SetStateAction<CoinflipState>>;
  totalBet: number;
  claimableBalance: ClaimBalanceRecord;
  prevClaimableBalance: number;
  resetCount: number;
  setResetCount: (number) => void;

  prevWonAmt: number;
  maxWager: MaxWagerRecord | undefined;
  handleStateChange: (state: Partial<CoinflipState>) => void;
  resetGame: VoidFn;
  bet: (onSuccess: VoidFn, onError: VoidFn) => Promise<void>;
  reveal: () => Promise<void>;
  claim: () => Promise<void>;
  refreshClaimableBalance: (tokens: tCoinflipSupportedTokens[]) => void;
  triggerAnimation: boolean;
  setTriggerAnimation: (boolean) => void;
}

type CoinBetState = {
  head: boolean;
  amount: number;
  decryptedRecord?: any;
};

const initialCoinflipState: CoinflipState = {
  wager: 1,
  betCount: 1,
  selectedSide: true,
  results: [],
  wonAmt: 0,
  revealCount: 0
};

export const MAX_BETS = 5;

const betFee: Record<GameTokenType, number> = {
  [GameTokenType.NATIVE]: 0.393932e6,
  [GameTokenType.TOKEN]: 0.569338e6
};
const claimFee: Record<GameTokenType, number> = {
  [GameTokenType.NATIVE]: 0.219791e6,
  [GameTokenType.TOKEN]: 0.384051e6
};

const initialBetState: CoinBetState = { head: true, amount: 0 };

export const CoinTossContext = createContext<ICoinTossContext | undefined>(
  undefined
);

export const CoinTossProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] =
    useState<CoinflipState>(initialCoinflipState);

  const [prevWonAmt, setPrevWonAmt] = useState<number>(0);
  const [headerDisabled, setHeaderDisabled] = useState<boolean>(false);
  const [totalBet, setTotalBet] = useState<number>(0);
  const [triggerAnimation, setTriggerAnimation] = useState<boolean>(false);
  const [betStates, setBetStates] = useState<Array<CoinBetState>>(
    Array(MAX_BETS).fill(initialBetState)
  );

  const [maxWager, setMaxWager] = useState<MaxWagerRecord>();
  const [prevClaimableBalance, setPrevClaimableBalance] = useState(0);
  const initialClaimBalance = () => {
    const tokens = Object.values(TOKEN_CONFIG)
      .filter((t) => t.isActive)
      .filter((t) =>
        CoinflipSupportedTokens.includes(t.symbol as tCoinflipSupportedTokens)
      )
      .map((token) => ({
        [token.symbol]: 0n
      }))
      .reduce((acc, val) => ({ ...acc, ...val }), {});
    return tokens;
  };

  const [claimableBalance, setClaimableBalance] = useState<ClaimBalanceRecord>(
    initialClaimBalance()
  );

  const { wager, betCount, selectedSide, results, wonAmt, revealCount } =
    gameState;

  const {
    publicKey,
    requestTransaction,
    connected,
    requestRecords,
    requestRecordPlaintexts
  } = useAleoWallet();
  const { addTxns } = useAleoTransaction();
  const { program } = useAleoContract();
  const { mode, tokenType } = useGameSetting();
  const { setCurrentTxnStep } = useTransaction();
  const { updateTokenBalance } = useTokens();
  const selectedToken = useSelectedToken();
  const token = useSelectedToken();
  const tokenClaimBalance = claimableBalance[token?.symbol];
  const [resetCount, setResetCount] = useState<number>(1);
  const { prevBalance, setPrevBalance } = useTokens();

  const tokenMaxWager = maxWager?.[tokenType] ?? 25;

  const handleStateChange = (state: Partial<CoinflipState>) => {
    setGameState((prev) => ({ ...prev, ...state }));
  };

  const resetGame = () => {
    setGameState(initialCoinflipState);
  };

  const CoinflipContractConfig = useMemo(() => {
    const createModeConfig = (mode: GameMode) => {
      const baseConfig = {
        revealMap: 'user_streak',
        claimBalanceMap: 'user_balance',
        getWalletKey: mode === GameMode.Public ? publicKey : hasher(publicKey)
      };

      const createTokenConfig = (tokenType: GameTokenType) => ({
        ...baseConfig,
        betFn: `bet_${mode === GameMode.Public ? 'public' : 'private'}_${tokenType}`,
        claimFn: `${mode === GameMode.Public ? 'public' : 'private'}_claim_${tokenType}`
      });

      return {
        [GameTokenType.NATIVE]: createTokenConfig(GameTokenType.NATIVE),
        [GameTokenType.TOKEN]: createTokenConfig(GameTokenType.TOKEN)
      };
    };

    return {
      [GameMode.Public]: createModeConfig(GameMode.Public),
      [GameMode.Private]: createModeConfig(GameMode.Private)
    };
  }, [publicKey]);

  function prepareCoinStateInput(betStates: CoinBetState[]) {
    const inputs = betStates.reduce<[LeoU64[], string[]]>(
      (acc, val) => {
        acc[0].push(js2leo.u64(convertNormalToBigIntValue(val.amount, 6)));
        acc[1].push(js2leo.boolean(val.head));
        return acc;
      },
      [[], []]
    );

    return [js2leo.arr2string(inputs[0]), js2leo.arr2string(inputs[1])];
  }

  async function prepareBetInputs(
    betStates: CoinBetState[]
  ): Promise<any[] | null> {
    const coinInput = prepareCoinStateInput(betStates);
    return coinInput;
  }

  async function getProgramMaxWager() {
    Object.entries(COINFILP_PROGRAM).forEach(
      async ([tokenType, programName]) => {
        const maxWagerRaw = await program(programName)
          .map('amount_limit')
          .get('true');

        const maxWager = +convertBigIntValueToNormal(
          leo2js.u64(maxWagerRaw),
          6
        );

        setMaxWager((prev) => ({
          ...prev,
          [tokenType]: maxWager
        }));
      }
    );
  }

  const getClaimableBalance = async (tokens: tCoinflipSupportedTokens[]) => {
    if (!publicKey) return;

    const balancePromises = tokens.map(async (t) => {
      const tokenDetail = getTokenDetail(t);
      if (tokenDetail?.tokenId) Promise.resolve(0n);

      const hashedTokenOwner = await hashTokenOwner({
        account: publicKey,
        token_id: tokenDetail.tokenId
      } as TokenOwner);

      const unclaimedBalanceRaw = await program(
        COINFILP_PROGRAM[
          tokenDetail?.isNative ? GameTokenType.NATIVE : GameTokenType.TOKEN
        ]
      )
        .map(CoinflipContractConfig[mode][tokenType].claimBalanceMap)
        .get(hashedTokenOwner);
      return leo2js.u64(unclaimedBalanceRaw) ?? 0;
    });

    const balances = await Promise.allSettled(balancePromises);
    balances.forEach((balance, index) => {
      if (balance.status === 'fulfilled') {
        const token = tokens[index];
        setClaimableBalance((prev) => ({
          ...prev,
          [token]: balance.value
        }));
      }
    });
  };

  async function getDecryptedRecords(
    amount: bigint,
    token_id: bigint,
    token_program: string
  ) {
    if (!publicKey) return;
    if (requestRecords) {
      const records = await requestRecords(token_program);
      let filteredRecords: any[] = [];
      for (const record of records) {
        if (
          leo2js.field(record.data.token_id) == token_id &&
          leo2js.u128(record.data.amount) >= amount
        ) {
          filteredRecords.push(record);
        }
      }
      return filteredRecords;
    }
  }

  async function bet(onSuccess: VoidFn, onError: VoidFn) {
    console.log(selectedToken, tokenType, 'token type');
    // from betstates calculate total bet by adding the amount in each value in betstate array
    // const totalBet = convertNormalToBigIntValue(betStates.reduce((acc, val) => acc + val.amount, 0),selectedToken.decimals);
    if (!connected) {
      toast.info('Please connect wallet ');
      return;
    }

    if (totalBet > tokenMaxWager) {
      toast.error(`Total bet should be less than ${tokenMaxWager}`);
      return;
    }

    let record: any[] | undefined;
    if (mode == GameMode.Private) {
      record = await getDecryptedRecords(
        convertNormalToBigIntValue(totalBet, selectedToken.decimals),
        selectedToken.tokenId,
        token.tokenProgram
      );
    }

    try {
      if (
        (selectedToken.balance < convertNormalToBigIntValue(totalBet) &&
          mode == GameMode.Public) ||
        (GameMode.Private && record?.length == 0)
      ) {
        toast.error('Insufficent balance in wallet');
        return;
      }

      //setting balance before betting
      setPrevBalance(
        +convertBigIntValueToNormal(token?.balance, token?.decimals)
      );

      const betInputs = await prepareBetInputs(betStates);
      console.log(totalBet, betStates, betInputs);
      if (!betInputs) {
        throw new Error('Failed to prepare inputs for bet: No inputs');
      }

      const inputs =
        tokenType === GameTokenType.NATIVE
          ? betInputs
          : mode == GameMode.Public
            ? [...betInputs, js2leo.field(selectedToken.tokenId)]
            : [record![0], ...betInputs, js2leo.field(selectedToken.tokenId)];

      const tx = Transaction.createTransaction(
        publicKey!,
        walletAdapterNetwork,
        COINFILP_PROGRAM[tokenType],
        CoinflipContractConfig[mode][tokenType].betFn,
        inputs,
        betFee[tokenType],
        false
      );

      console.log('this is the txn', tx);
      if (requestTransaction) {
        setCurrentTxnStep(TRANSACTION_STEPS.CONFIRMATION);
        const txId = await requestTransaction(tx);
        setCurrentTxnStep(TRANSACTION_STEPS.PENDING);

        addTxns({
          txID: txId,
          onSuccess: () => {
            onSuccess();
            setCurrentTxnStep(TRANSACTION_STEPS.IDLE);
            updateTokenBalance([selectedToken.symbol as SupportedTokens]);
            toast.success('Successfully placed bet');
          },
          onError: () => {
            onError();
            setCurrentTxnStep(TRANSACTION_STEPS.IDLE);
            toast.error('Failed to place bet.');
          }
        });

        console.log(prevBalance, 'prev balance before bet');
      }
    } catch (e) {
      setCurrentTxnStep(TRANSACTION_STEPS.IDLE);
      // toast.error('Failed to place bet.');
      toast.error(`Failed to place bet. Error: ${e || 'Unknown error'}`);
      console.error('Error on placing bet ==> ', e);
    }
  }

  const reveal = async () => {
    const tokenClaimBalance = claimableBalance[token?.symbol];
    if (!publicKey) return;

    try {
      let revealedResults = results;

      if (revealedResults.length <= 0) {
        setPrevClaimableBalance(
          +convertBigIntValueToNormal(tokenClaimBalance, token?.decimals)
        );
        const allRevealedStates: boolean[] = leo2js.string2arr(
          await program(COINFILP_PROGRAM[tokenType])
            .map(CoinflipContractConfig[mode][tokenType].revealMap)
            .get(selectedToken.hashedTokenOwner),
          leo2js.boolean
        );

        console.log('revealed', allRevealedStates);
        const winStatus = allRevealedStates.slice(0, betCount);
        console.log('after slice', winStatus);
        revealedResults = winStatus.map((r, i) =>
          r ? betStates[i].head : !betStates[i].head
        );
        handleStateChange({ results: revealedResults });
      }

      if (selectedSide === revealedResults[revealCount]) {
        setPrevWonAmt(wonAmt);
        setTimeout(() => {
          handleStateChange({ wonAmt: wonAmt + wager * 2 });
        }, 2000);
      }
      handleStateChange({ revealCount: revealCount + 1 });
    } catch (e) {
      console.error('Error on revealing coin toss results ==> ', e);
    }
  };

  const claim = async () => {
    const tokenClaimableBalance = claimableBalance[selectedToken?.symbol];
    if (!tokenClaimableBalance || tokenClaimableBalance <= 0) {
      toast.error('No balance to claim');
      return;
    }
    try {
      const unclaimedBalanceLeo = js2leo.u64(tokenClaimableBalance);
      console.log('USER UNCLAIMED BALANCE ==>', unclaimedBalanceLeo);

      const tx = Transaction.createTransaction(
        publicKey!,
        walletAdapterNetwork,
        COINFILP_PROGRAM[tokenType],
        CoinflipContractConfig[mode][tokenType].claimFn,
        [unclaimedBalanceLeo, js2leo.field(selectedToken.tokenId)],
        claimFee[tokenType],
        false
      );
      console.log('this is tx', tx);
      if (requestTransaction) {
        setCurrentTxnStep(TRANSACTION_STEPS.CONFIRMATION);
        const txId = await requestTransaction(tx);
        setCurrentTxnStep(TRANSACTION_STEPS.PENDING);

        addTxns({
          txID: txId,
          onSuccess: async () => {
            await sleep(300);
            setCurrentTxnStep(TRANSACTION_STEPS.IDLE);
            toast.success('Successfully claimed');
            updateTokenBalance([selectedToken.symbol as SupportedTokens]);
            getClaimableBalance([
              selectedToken.symbol as tCoinflipSupportedTokens
            ]);
          },
          onError: () => {
            setCurrentTxnStep(TRANSACTION_STEPS.IDLE);
            toast.error('Failed to claim.');
            console.error('ERROR ON CLAIMING COIN FILP WON BALANCE');
          }
        });
      }
    } catch (e) {
      setCurrentTxnStep(TRANSACTION_STEPS.IDLE);
      toast.error('Failed to claim.');
      console.error('Error on claiming coinflip balance ==> ', e);
    }
  };

  useEffect(() => {
    if (!publicKey) return;
    getClaimableBalance(
      Object.keys(claimableBalance).map((t) => t as tCoinflipSupportedTokens)
    );
  }, [publicKey, mode]);

  useEffect(() => {
    setTotalBet(wager * betCount);
  }, [wager, betCount]);

  useEffect(() => {
    if (!wager || !betCount) return;

    setBetStates((prev) => {
      return prev.map((_, i) =>
        i < betCount
          ? {
              head: selectedSide,
              amount: wager
            }
          : initialBetState
      );
    });
  }, [wager, selectedSide, betCount]);

  useEffect(() => {
    getProgramMaxWager();
  }, []);

  return (
    <CoinTossContext.Provider
      value={{
        bet,
        reveal,
        claim,
        gameState,
        headerDisabled,
        setHeaderDisabled,
        setGameState,
        maxWager,
        handleStateChange,
        resetGame,
        totalBet,
        claimableBalance,
        prevClaimableBalance,
        resetCount,
        setResetCount,

        prevWonAmt,
        refreshClaimableBalance: getClaimableBalance,
        triggerAnimation,
        setTriggerAnimation
      }}
    >
      {children}
    </CoinTossContext.Provider>
  );
};

export const useCoinToss = () => {
  const ctx = useContext(CoinTossContext);
  if (!ctx) {
    throw new Error('useCoinToss should be inside CoinTossProvider');
  }
  return ctx;
};
