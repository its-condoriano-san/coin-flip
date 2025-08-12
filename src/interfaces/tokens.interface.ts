import { tNetworkTypes } from '@/configs/token';

export type TokenDetails = {
  name: string;
  symbol: string;
  decimals: number;
  isActive: boolean;
  isNative?: boolean;
  tokenId: bigint;
  tokenProgram: string;
  balanceMap: string;
  tokenAddress: Record<tNetworkTypes, string>;
  logo: string;
};
