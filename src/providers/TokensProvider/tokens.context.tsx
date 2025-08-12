import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState
} from 'react';

import { VITE_CHIP_TOKEN_MINT_PROGRAM, VITE_NETWORK_TYPE } from '@/configs/env';
import {
  ALEO_TOKENS,
  getTokenDetail,
  SupportedTokens,
  tNetworkTypes,
  TOKEN_CONFIG
} from '@/configs/token';
import { useAleoContract } from '@/hooks/useAleoContract';
import { useAleoWallet } from '@/hooks/useAleoWallet';
import { js2leo, leo2js } from '@/lib/aleo';
import { TokenOwner } from '@/lib/aleo/types/leo-types';
import { hashTokenOwner } from '@/utils/hasher';
import { parseJSONLikeString } from '@/utils/parser';
import {
  Transaction,
  WalletAdapterNetwork
} from '@demox-labs/aleo-wallet-adapter-base';
import { useAleoTransaction } from '@/hooks/useAleoTransaction';
import { toast } from 'react-toastify';
import { TRANSACTION_STEPS } from '@/configs/transaction';
import { useTransaction } from '../TransactionProvider/transaction.provider';
import { VoidFn } from '@/interfaces/common';

export interface ITokenBalance {
  name: string;
  balance: bigint;

  decimals: number;
  tokenAddress: string;
}

type TokenBalanceRecord = Partial<Record<SupportedTokens, ITokenBalance>>;

interface ITokenContext {
  tokens: TokenBalanceRecord;
  selectedToken: SupportedTokens;
  prevBalance: number; //loot previous balance
  setPrevBalance: (number) => void;
  setSelectedToken: (token: SupportedTokens) => void;
  updateTokenBalance: (tokens: SupportedTokens[]) => void;
  getBalance: (token: SupportedTokens) => bigint;
  mintChipToken: VoidFn;
}

const initialState: ITokenContext = {
  tokens: {},
  selectedToken: ALEO_TOKENS.ALEO,
  setSelectedToken: (t) => {},
  setPrevBalance: (t) => {},
  prevBalance: 0,

  updateTokenBalance: (t) => {},
  getBalance: (t) => {
    return 0n;
  },
  mintChipToken: () => {}
};

export const TokenContext = createContext<ITokenContext>(initialState);

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const intialTokenBalance = useCallback(() => {
    const tokens = Object.values(TOKEN_CONFIG)
      .filter((t) => t.isActive)
      .map((token) => ({
        [token.symbol]: {
          name: token.name,
          balance: 0n,
          decimals: token.decimals,
          tokenAddress: token.tokenAddress[VITE_NETWORK_TYPE as tNetworkTypes]
        }
      }))
      .reduce((acc, val) => ({ ...acc, ...val }), {});

    return tokens;
  }, []);

  const [tokens, setTokens] =
    useState<TokenBalanceRecord>(intialTokenBalance());
  const [selectedToken, setSelectedToken] = useState<SupportedTokens>(
    ALEO_TOKENS.CHIP
  );

  const [prevBalance, setPrevBalance] = useState(0);

  const { publicKey, requestTransaction } = useAleoWallet();
  const { program } = useAleoContract();
  const { addTxns } = useAleoTransaction();
  const { setCurrentTxnStep } = useTransaction();

  const getTokenBalance = useCallback(
    async (token: SupportedTokens) => {
      if (!publicKey) return 0n;
      const tokenDetail = getTokenDetail(token);
      let tokenOwnerKey = publicKey;
      if (tokenDetail.symbol !== ALEO_TOKENS.ALEO) {
        try {
          const tokenOwner: TokenOwner = {
            account: publicKey,
            token_id: tokenDetail.tokenId
          };
          tokenOwnerKey = await hashTokenOwner(tokenOwner);
        } catch (e) {
          console.log(e);
        }
      }

      let balanceRaw = await program(tokenDetail.tokenProgram ?? '')
        .map(tokenDetail.balanceMap)
        .get(tokenOwnerKey);

      if (tokenDetail.balanceMap === 'authorized_balances') {
        balanceRaw = parseJSONLikeString(balanceRaw)?.balance;
      }
      const parsedBalance =
        tokenDetail.balanceMap === 'authorized_balances'
          ? leo2js.u128(balanceRaw)
          : leo2js.u64(balanceRaw);

      console.log({ balanceRaw, parsedBalance });
      return parsedBalance ?? 0n;
    },
    [program, publicKey]
  );

  const getTokenBalances = async (tokens: SupportedTokens[]) => {
    const balancePromises = tokens.map((a) => getTokenBalance(a));
    const balances = await Promise.allSettled(balancePromises);

    balances.forEach((balance, index) => {
      if (balance.status === 'fulfilled') {
        const token = tokens[index];
        setTokens((prev) => ({
          ...prev,
          [token]: {
            ...prev[token]!,
            balance: balance.value
          }
        }));
      }
    });
  };

  const getBalance = (token: SupportedTokens): bigint => {
    const balance = tokens[token];
    if (!balance) return 0n;
    return balance.balance;
  };

  const mintChipToken = async () => {
    if (!publicKey) {
      toast.error('Wallet not connected');
      return;
    }

    const lootTokenConfig = TOKEN_CONFIG[ALEO_TOKENS.CHIP];
    const tx = Transaction.createTransaction(
      publicKey!,
      VITE_NETWORK_TYPE == 'mainnet'
        ? WalletAdapterNetwork.MainnetBeta
        : WalletAdapterNetwork.TestnetBeta,
      VITE_CHIP_TOKEN_MINT_PROGRAM,
      'free_mint',
      [js2leo.field(lootTokenConfig.tokenId), publicKey!],
      500_000,
      false
    );

    if (requestTransaction) {
      setCurrentTxnStep(TRANSACTION_STEPS.CONFIRMATION);
      const txId = await requestTransaction(tx);
      setCurrentTxnStep(TRANSACTION_STEPS.PENDING);

      addTxns({
        txID: txId,
        onSuccess: () => {
          setCurrentTxnStep(TRANSACTION_STEPS.IDLE);
          getTokenBalances([lootTokenConfig.symbol as SupportedTokens]);
          toast.success('Successfully minted token');
        },
        onError: () => {
          toast.error('Failed to mint token');
        }
      });
    }
  };

  useEffect(() => {
    if (!publicKey) return;

    getTokenBalances(Object.keys(tokens).map((t) => t as SupportedTokens));

    return () => setTokens(() => ({ ...intialTokenBalance() }));
  }, [publicKey]);

  return (
    <TokenContext.Provider
      value={{
        tokens,
        selectedToken,
        prevBalance,
        setSelectedToken,
        updateTokenBalance: getTokenBalances,
        getBalance,
        mintChipToken,
        setPrevBalance
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
