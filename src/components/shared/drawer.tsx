import { X } from 'lucide-react';
import React from 'react';
type ICustomDrawer = {
  close: () => void;
  children?: React.ReactNode;
};

const CustomDrawer = ({ close, children }: ICustomDrawer) => {
  return (
    <div className="absolute right-0 top-0 z-10 h-[360px] w-full  bg-[#2B295F] shadow-lg transition-all duration-700 ease-out">
      <button onClick={close} className="absolute right-8 top-8">
        <X />
      </button>

      <div className="mt-10 flex h-full flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default CustomDrawer;
