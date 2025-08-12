import { js2leo } from '@/lib/aleo';
import { object2struct } from '@/lib/aleo/js2leo/common';
import { TokenOwner } from '@/lib/aleo/types/leo-types';
import init, { hash } from 'aleo-hasher-web';

export const hasher = async (data: any): Promise<string> => {
  const dataString = js2leo.json(data);
  await init('../../aleo_hasher_bg.wasm');
  const dataHash = hash('bhp256', dataString, 'field');
  return dataHash;
};

export const hashTokenOwner = async (tokenOwner: TokenOwner) => {
  return hasher(object2struct(tokenOwner, [js2leo.address, js2leo.field]));
};
