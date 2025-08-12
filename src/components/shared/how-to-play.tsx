import { FavIcon, StepIndicator, Game } from '@/assets/icons';

import React from 'react';
import { Typography } from '../ui/typography';

type HowToPlayProps = {
  playingSteps?: {
    title: string;
    description: string;
  }[];
  children?: React.ReactNode;
};

const HowToPlay = ({ children, playingSteps }: HowToPlayProps) => {
  return (
    <div className="flex h-fit  flex-col gap-6 rounded-lg bg-[#1D1B49] p-8">
      <div className="inline-flex items-center gap-3">
        <Typography variant={'subtitle-lg'}>How to Play</Typography>
        <img src={Game} className="w-10" alt="play-icon" />
      </div>
      <div className="flex flex-wrap justify-between gap-4">
        {playingSteps?.map((step, index) => {
          return (
            <div
              className="flex w-full max-w-[400px]  flex-col gap-[28px] rounded-lg border border-[#ECD96F] p-[28px]"
              key={index}
            >
              <div className="inline-flex items-center gap-2">
                <span className="font-dm-sans text-[24px] font-medium">
                  Step
                </span>
                <div className="relative w-fit">
                  <img src={StepIndicator} alt="step-bg" />
                  <span className="trans absolute left-1/2 top-1/2 -translate-x-2 -translate-y-1/2 text-[18px] font-bold text-[#ECD96F]">
                    {index + 1}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-3">
                  <span className="font-dm-sans text-[24px] font-medium leading-[31.25px]">
                    {step.title}
                  </span>
                  <span className="text-[16px] font-light leading-[20.16px]">
                    {step.description}
                  </span>
                </div>
                <img className="w-[48px]" src={FavIcon} alt="ticket" />
              </div>
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
};

export default HowToPlay;
