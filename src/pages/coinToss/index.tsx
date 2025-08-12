import CoinTossLayout from '@/components/layout/coinTossLayout';
import CoinToss from './components/CoinToss';
import HowToPlay from '@/components/shared/how-to-play';
import { CoinTossProvider } from '@/providers/coinTossProvider';
import { GameSettingProvider } from '@/providers/GameSettingProvider';
import MintInformation from '@/components/shared/mint-info';
import { useRef } from 'react';

const playingSteps = [
  {
    title: 'Select Bet Amount',
    description: 'Select the amount of token you want to bet'
  },
  {
    title: 'Select No. of Flips',
    description: 'Select the number of times you would like to flip the coin'
  },
  {
    title: 'Place Your Bet(s)',
    description:
      'Place bet & flip the Coin! You are a winner if the flip matches what you selected'
  }
];

const CoinTossPage = () => {
  const mintInfoRef = useRef<HTMLDivElement>(null);

  const scrollToMintInformation = () => {
    if (mintInfoRef.current) {
      mintInfoRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <GameSettingProvider localStoragePrefix="cf">
      <CoinTossProvider>
        <CoinTossLayout infoClick={scrollToMintInformation}>
          <CoinToss />
        </CoinTossLayout>
      </CoinTossProvider>
    </GameSettingProvider>
  );
};

export default CoinTossPage;
