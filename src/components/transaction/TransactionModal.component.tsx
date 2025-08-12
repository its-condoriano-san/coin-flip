import { TRANSACTION_STEPS } from '@/configs/transaction';
import { IModalProps } from '@/interfaces/common';
import { useTransaction } from '@/providers/TransactionProvider/transaction.provider';
import { FC, useCallback } from 'react';
import LoaderModal from '../shared/loader-modal';

export const TransactionModal: FC<IModalProps> = ({ isOpen }) => {
  const { currentTxnStep } = useTransaction();
  const getTransactionComponent = useCallback(() => {
    switch (currentTxnStep) {
      case TRANSACTION_STEPS.CONFIRMATION:
        return <LoaderModal />;
      case TRANSACTION_STEPS.PENDING:
        return <LoaderModal />;
      case TRANSACTION_STEPS.SUCCESS:
        return <></>;
      case TRANSACTION_STEPS.FAILED:
        return <></>;
      default:
        <></>;
    }
  }, [currentTxnStep]);

  if (!isOpen) return <></>;

  return getTransactionComponent();
};
