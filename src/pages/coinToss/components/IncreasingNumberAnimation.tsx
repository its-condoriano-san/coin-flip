import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import React, { useEffect, useState } from 'react';

type IncreasingNumberAnimationProps = {
  value: number;
  className?: string;
  isVisible: boolean;
};

const IncreasingNumberAnimation = ({
  value,
  className,
  isVisible
}: IncreasingNumberAnimationProps) => {
  return (
    <CSSTransition
      in={isVisible}
      timeout={1000}
      classNames="fade"
      unmountOnExit
    >
      <div
        className={clsx(
          className,
          ' absolute left-1/2 top-0 -translate-x-1/2 text-[12px] font-medium leading-[15.12px] text-[#51D54E]'
        )}
      >
        +{value}
      </div>
    </CSSTransition>
  );
};

export default IncreasingNumberAnimation;
