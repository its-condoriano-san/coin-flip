import { useCallback, useState, useRef } from 'react';

export const useThrottle = (
  func: (...args: any[]) => Promise<void>,
  cooldownTimer = 500
) => {
  const cooldownRef = useRef<boolean>(false);

  const throttledFunc = useCallback(
    (...args) => {
      return new Promise<void>((resolve, reject) => {
        if (!cooldownRef.current) {
          cooldownRef.current = true;

          func(...args)
            .then(resolve)
            .catch(reject)
            .finally(() => {
              setTimeout(() => {
                cooldownRef.current = false;
              }, cooldownTimer);
            });
        } else {
          console.log('Function is cooling down', cooldownTimer);
          resolve(void 0);
        }
      });
    },
    [func, cooldownTimer]
  );

  return { throttledFunc };
};
