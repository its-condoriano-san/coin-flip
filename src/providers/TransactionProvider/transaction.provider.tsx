import { TRANSACTION_STEPS } from '@/configs/transaction';
import { createContext, ReactNode, useContext, useState } from 'react';
import { ValueOf } from 'type-fest';

interface ITransactionContext {
  currentTxnStep: ValueOf<typeof TRANSACTION_STEPS>;
  setCurrentTxnStep: (step: ValueOf<typeof TRANSACTION_STEPS>) => void;
}

const initialState: ITransactionContext = {
  currentTxnStep: TRANSACTION_STEPS.IDLE,
  setCurrentTxnStep: (step) => {}
};

export const TransactionContext =
  createContext<ITransactionContext>(initialState);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(initialState.currentTxnStep);

  const handleChangeTxnStep = (newStep: ValueOf<typeof TRANSACTION_STEPS>) => {
    setCurrentStep(newStep);
  };

  return (
    <TransactionContext.Provider
      value={{
        currentTxnStep: currentStep,
        setCurrentTxnStep: handleChangeTxnStep
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => useContext(TransactionContext);
