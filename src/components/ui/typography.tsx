import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const textVariants = cva('', {
  variants: {
    variant: {
      default: '',
      'title-xl':
        'bg-primary text-primary-foreground shadow hover:bg-primary/90',
      'title-lg':
        'font-dm-sans font-bold text-center leading-[62.5px] text-[48px]',
      'title-sm': 'font-dm-sans font-medium text-center leading-[20.83px]',
      'subtitle-lg':
        ' font-dm-sans text-[24px] font-bold leading-[31.25px] text-center',
      'subtitle-md': 'hover:bg-accent hover:text-accent-foreground',
      'subtitle-sm': 'text-primary underline-offset-4 hover:underline',
      'subtitle-base': 'text-primary underline-offset-4 hover:underline',
      'subtitle-regular': 'font-normal text-white leading-[20.16px]',
      'body-xl':
        'font-dm-sans md:text-[48px] font-bold md:leading-[62.5px] text-[32px] tracking-[4%] text-center',
      'body-lg': 'text-[36px] leading-[45.36px] text-center',
      'body-md': 'text-[14px] leading-[36px]',
      'body-regular':
        'sm:text-[24px] sm:leading-[30.24px] text-xl leading-[22.68px]',
      'body-sm': 'text-[14px] leading-[17.64px]',
      'body-xs': 'text-[12px] font-light leading-[15.12px]',
      ' button-lg': 'text-primary underline-offset-4 hover:underline',
      'button-sm': 'text-primary underline-offset-4 hover:underline',
      'button-xs': 'text-primary underline-offset-4 hover:underline',
      'label-lg': 'text-primary underline-offset-4 hover:underline',
      'label-md': 'text-[16px] leading-[20.16px] text-center',
      'label-sm': 'text-[14px] leading-[17.64px] font-medium tracking-[7%]',
      'label-base': 'text-primary underline-offset-4 hover:underline',
      'card-lg': 'text-primary underline-offset-4 hover:underline',
      'card-md': 'text-primary underline-offset-4 hover:underline',
      'card-sm': 'text-primary underline-offset-4 hover:underline',
      'card-xs': 'text-primary underline-offset-4 hover:underline',
      'card-light':
        'text-[20px] leading-[30px] text-center text-[#92819F] font-light',
      body1: 'body1',
      h2: 'h2'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

export interface TextProps extends VariantProps<typeof textVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  className?: string;
  children: React.ReactNode;
}

const Typography = ({
  className,
  variant,
  as,
  children,
  ...props
}: TextProps) => {
  const Comp = as ?? 'span';
  return (
    <Comp className={cn(textVariants({ variant, className }))} {...props}>
      {children}
    </Comp>
  );
};

Typography.displayName = 'Typography';

export { Typography, textVariants };
