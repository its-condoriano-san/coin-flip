import React from 'react';
import Header from '../shared/header';
import Footer from '../shared/footer';
import clsx from 'clsx';
import { TransactionModal } from '../transaction/TransactionModal.component';
import { useTransaction } from '@/providers/TransactionProvider/transaction.provider';
import { useCoinToss } from '@/providers/coinTossProvider';
import { CoinflipSupportedTokens } from '@/configs/cointoss';
import { VITE_NETWORK_TYPE } from '@/configs/env';

type CoinTossLayout = {
  children: React.ReactNode;
  className?: string;
  infoClick?: () => void;
};

const CoinTossLayout = ({ children, className, infoClick }: CoinTossLayout) => {
  const { currentTxnStep } = useTransaction();
  const { claimableBalance, prevClaimableBalance, claim, headerDisabled } =
    useCoinToss();
  console.log('Network', VITE_NETWORK_TYPE);
  return (
    <div className={clsx(className, 'lg:space-y-8 ')}>
      <Header
        claimable={true}
        claimableBalance={claimableBalance}
        prevClaimableBalance={prevClaimableBalance}
        claim={claim}
        supportedTokens={CoinflipSupportedTokens}
        headerDisabled={headerDisabled}
        infoClick={infoClick}
      />
      <section className="mx-auto max-w-[90vw] md:max-w-[80vw] md:space-y-8">
        {children}
      </section>
      <Footer />
      <TransactionModal
        isOpen={Boolean(currentTxnStep)}
        onModalClose={() => {}}
      />
    </div>
  );
};

export default CoinTossLayout;
