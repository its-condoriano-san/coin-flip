import { Link } from 'react-router-dom';

import { ALEO_TOKENS, SupportedTokens } from '@/configs/token';
import { useAleoWallet } from '@/hooks/useAleoWallet';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { ValueOf } from 'type-fest';
import { Button } from '../ui/button';
import CustomDrawer from './drawer';
import Gamewallet from './game-wallet';
import MintInfoModal from './mint-info-model';
import WalletConnectModal from './wallet-connect-modal';

// const navlinks = [
//   {
//     title: 'Home',
//     link: '/'
//   },
//   {
//     title: 'Lottery',
//     link: '/lottery'
//   }
// ];

type HeaderProps = {
  claimable?: boolean;
  claimableBalance?: Partial<Record<SupportedTokens, bigint>>;
  prevClaimableBalance?: number;
  claim?: () => Promise<void>;
  supportedTokens?: ValueOf<typeof ALEO_TOKENS>[];
  headerDisabled?: boolean;
  infoClick?: () => void;
};

export default function Header({
  claimable,
  claimableBalance,
  prevClaimableBalance,
  claim,
  supportedTokens,
  headerDisabled,
  infoClick
}: HeaderProps) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { connected } = useAleoWallet();
  return (
    <>
      <div className="flex items-center justify-between px-8 py-8 sm:px-24">
        <Link to={`/coinflip`}>
          {' '}
          <p className="text-xl">Coinflip Game</p>
        </Link>

        <button
          onClick={() => setOpenDrawer(!openDrawer)}
          className="flex sm:hidden"
        >
          <Menu />
        </button>

        <div className="hidden items-center gap-6 sm:flex">
          {/* {navlinks.map((item, index) => {
            return (
              <Link
                key={index}
                to={item.link}
                className="font-semibold leading-[20.16px] text-foreground"
              >
                {item.title}
              </Link>
            );
          })} */}

          {!connected ? (
            <>
              <WalletConnectModal
                trigger={
                  <Button className="rounded-full">Connect Wallet</Button>
                }
              />
            </>
          ) : (
            <>
              <Gamewallet
                isPrivate={false}
                isClaimable={claimable}
                claimableBalance={claimableBalance}
                prevClaimableBalance={prevClaimableBalance}
                claim={claim}
                supportedTokens={supportedTokens}
                headerDisabled={headerDisabled}
                infoClick={infoClick}
              />
            </>
          )}
        </div>
      </div>
      {openDrawer && (
        <CustomDrawer close={() => setOpenDrawer(false)}>
          <div className="flex flex-col items-center gap-6">
            {/* {navlinks.map((item, index) => {
              return (
                <Link
                  key={index}
                  to={item.link}
                  className="text-[20px] font-semibold leading-[20.16px] text-foreground"
                >
                  {item.title}
                </Link>
              );
            })} */}
            <MintInfoModal
              trigger={
                <Button variant={'secondary'} className="rounded-full ">
                  Free CHIP
                </Button>
              }
            />
          </div>
        </CustomDrawer>
      )}
    </>
  );
}
