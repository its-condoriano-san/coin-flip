import { useCallback } from 'react';
import axios from 'axios';
import { VITE_ALEO_BASE_URL, VITE_NETWORK_TYPE } from '@/configs/env';

export const useAleoContract = () => {
  const program = useCallback((program: string) => {
    return {
      map: (mName: string) => mapping(program, mName)
    };
  }, []);

  const mapping = useCallback((program: string, mapping: string) => {
    return {
      get: async (mKey: any) => {
        const response = await axios.get(
          `${VITE_ALEO_BASE_URL}/${VITE_NETWORK_TYPE}/program/${program}/mapping/${mapping}/${mKey}`
        );
        return response.data;
      }
    };
  }, []);
  return {
    program
  };
};
