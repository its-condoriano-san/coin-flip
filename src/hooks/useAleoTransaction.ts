import { useCallback, useEffect, useState } from 'react';
import { useAleoWallet } from './useAleoWallet';

export interface IAleoTransaction {
  txID: string;
  onSuccess: () => void;
  onError: () => void;
}

export const useAleoTransaction = () => {
  const [transactions, setTransactions] = useState<IAleoTransaction[]>([]);

  const { transactionStatus } = useAleoWallet();

  const addTxns = (txn: IAleoTransaction) => {
    setTransactions((prev) => {
      if (prev.map((p) => p.txID).includes(txn.txID)) return prev;
      else return [...prev, txn];
    });
  };

  const getTransactionStatus = useCallback(
    async (tx: IAleoTransaction) => {
      try {
        let status = 'Pending';
        if (transactionStatus) {
          status = await transactionStatus(tx.txID);
        }
        if (status === 'Finalized') {
          setTransactions((prev) => prev.filter((txn) => txn.txID !== tx.txID));
          tx.onSuccess();
        } else if (status === 'Failed' || status === 'Reject') {
          setTransactions((prev) => prev.filter((txn) => txn.txID !== tx.txID));
          tx.onError();
        } else {
          console.log({ status });
          return;
        }
      } catch (error) {
        setTransactions((prev) => prev.filter((txn) => txn.txID !== tx.txID));
        tx.onError();
        return;
      }
    },
    [transactionStatus],
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    // Clear the previous timer at the start of the effect
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }

    // Only set a new timer if there are transactions
    if (transactions.length > 0) {
      intervalId = setInterval(() => {
        transactions.forEach((tx) => {
          getTransactionStatus(tx);
        });
      }, 2_000);
    }

    // Clear the timer when the component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [transactions, getTransactionStatus]);

  return {
    addTxns,
  };
};
