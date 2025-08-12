import { useContext, useEffect, useMemo, useState } from 'react';
import { TokenContext } from './tokens.context';
import { getTokenDetail } from '@/configs/token';
import { useAleoWallet } from '@/hooks/useAleoWallet';
import { hashTokenOwner } from '@/utils/hasher';
import { TokenOwner } from '@/lib/aleo/types/leo-types';

export const useTokens = () => ({ ...useContext(TokenContext) });

export const useSelectedToken = () => {
  const { selectedToken, getBalance } = useTokens();
  const { publicKey } = useAleoWallet();
  const [tokenDetails, setTokenDetails] = useState<any | null>();

  const tokenConfig = useMemo(() => {
    return selectedToken ? getTokenDetail(selectedToken) : null;
  }, [selectedToken]);

  const hashedTokenOwner = useMemo(() => {
    if (!tokenConfig?.tokenId || !publicKey) return Promise.resolve(null);
    return hashTokenOwner({
      account: publicKey,
      token_id: tokenConfig.tokenId
    } as TokenOwner);
  }, [tokenConfig, publicKey]);

  useEffect(() => {
    (async () => {
      if (!tokenConfig || !publicKey) {
        setTokenDetails(null);
        return;
      }

      try {
        setTokenDetails({
          ...tokenConfig,
          balance: getBalance(selectedToken),
          hashedTokenOwner: await hashedTokenOwner
        });
      } catch (e) {
        console.error('Error on fetching token details ==> ', e);
      }
    })();
  }, [selectedToken, publicKey, getBalance]);

  return tokenDetails;
};
