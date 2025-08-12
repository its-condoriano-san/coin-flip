import { Telegram, Twitter } from '@/assets/icons';
import { Button } from '../ui/button';
import { Typography } from '../ui/typography';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="mx-auto w-full max-w-[90vw] space-y-4  py-8">
      <div className="flex justify-between">
        <div className="flex gap-4">
          {/* <a href="">Terms of Service</a>
          <a href="">FAQs</a>
          <a href="">Privacy Policy</a> */}
        </div>
      </div>

      <div className="w-full border-t border-[#727272] pt-4 opacity-50">
        <Typography className="font-normal " variant={'subtitle-regular'}>
          © 2024 All rights reserved.
        </Typography>
      </div>
    </div>
  );
};

export default Footer;
