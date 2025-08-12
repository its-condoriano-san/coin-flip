import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Copy, Private, Public } from '@/assets/icons';
import { Checkbox } from '../ui/checkbox';
import { useAleoWallet } from '@/hooks/useAleoWallet';
import { CopyToClipboard } from './copy-to-clipboard';

type ProfilePopoverProps = {
  trigger: React.ReactNode;
};

const popoverLinks = [
  {
    title: 'Profile',
    link: '/profile'
  },
  {
    title: 'Notification',
    link: '/notification'
  },
  {
    title: 'Logout',
    link: '/logout'
  }
];

const walletType = [
  {
    title: 'Private',
    icon: Private,
    balance: 0,
    checked: false
  },
  {
    title: 'Public',
    icon: Public,
    balance: 0,
    checked: true //default for now
  }
];

const ProfilePopover = ({ trigger }: ProfilePopoverProps) => {
  const { publicKey, reset } = useAleoWallet();

  if (!publicKey) return;

  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent
        className="mt-4 w-[210px] space-y-6 bg-[#1D1B49] pb-4"
        align={'end'}
      >
        <div className="space-y-3 bg-[#2B295F] p-[12px]">
          <div className="inline-flex h-[53px] w-full items-center justify-between px-[12px]">
            <span>
              {publicKey.slice(0, 6)}..{publicKey.slice(-6)}
            </span>
            <CopyToClipboard textToCopy={publicKey} />
          </div>
          <div className="flex justify-between gap-1 pr-[12px]">
            {walletType.map((item, index) => {
              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  <label htmlFor={item.title}>
                    <Checkbox
                      id={item.title}
                      defaultChecked={item.checked}
                      disabled={!item.checked}
                    />{' '}
                    <span>{item.title}</span>
                  </label>
                  <div className="flex gap-1">
                    <img src={item.icon} alt={item.title} />
                    <span>{item.balance}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cursor-pointer pl-[24px]" onClick={reset}>
          Logout
        </div>

        {/* {popoverLinks.map((item, index) => {
          return (
            <div key={index} className="pl-[24px]">
              <a href={item.link}>{item.title}</a>
            </div>
          );
        })} */}
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
