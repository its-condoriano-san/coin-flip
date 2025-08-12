import { ethers } from 'ethers';

export const toThousands = (num: string): string => {
  if (+num < 1000) return num;

  const reg = /\d{1,3}(?=(\d{3})+$)/g;
  if (num.includes('.')) {
    const [_integer, _decimal] = num.split('.');
    return _integer.replace(reg, '$&,') + '.' + _decimal;
  } else {
    return num.replace(reg, '$&,');
  }
};

export const toFormatNumber = (
  num: string,
  fix = 2,
  thousand = false,
  cutZero = false
): string => {
  if (!/^(-)?[0-9.]+$/g.test(num)) return '0';
  if (!num.includes('.')) {
    num = num + '.';
  }
  num = num + '00000000';
  const index = num.indexOf('.');
  num = num.slice(0, index + fix + 1);
  if (cutZero) {
    while (num.includes('.') && (num.endsWith('.') || num.endsWith('0'))) {
      num = num.slice(0, -1);
    }
  }
  if (thousand) {
    num = toThousands(num);
  }
  return num;
};

export const toFixedCutZero = (
  num: string,
  fix = 2,
  thousand = false
): string => {
  return toFormatNumber(num, fix, thousand, true);
};

export const convertNormalToBigIntValue = (
  value: string | number,
  decimals = 6
): bigint => {
  const formatted = BigInt(Number(value.toString()) * Math.pow(10, decimals));
  return BigInt(formatted);
};

export const convertBigIntValueToNormal = (
  value: bigint | string,
  decimals = 6,
  fix = 4,
  thousands = false
): string => {
  if (!value) return toFixedCutZero('0', fix, thousands);
  const formatted = ethers.formatUnits(BigInt(value), decimals);

  return toFixedCutZero(formatted, fix, thousands);
};
