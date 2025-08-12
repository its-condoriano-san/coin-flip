import { GameTokenType } from '@/providers/GameSettingProvider';
import { ALEO_TOKENS } from './token';
import { ValueOf } from 'type-fest';
import { COINFLIP_NATIVE_PROGRAM, COINFLIP_TOKEN_PROGRAM } from './env';

export const COINFILP_PROGRAM: Record<GameTokenType, string> = {
  [GameTokenType.NATIVE]: COINFLIP_NATIVE_PROGRAM,
  [GameTokenType.TOKEN]: COINFLIP_TOKEN_PROGRAM
};

export type tCoinflipSupportedTokens = ValueOf<
  Pick<typeof ALEO_TOKENS, 'ALEO' | 'CHIP'>
>;

export const CoinflipSupportedTokens: ValueOf<typeof ALEO_TOKENS>[] = [
  ALEO_TOKENS.CHIP,
  ALEO_TOKENS.ALEO
];
