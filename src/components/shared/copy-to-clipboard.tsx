import { useState } from 'react';
import { Copy } from '@/assets/icons';

type CopyToClipboardProps = {
  textToCopy: string;
};

export const CopyToClipboard = ({ textToCopy }: CopyToClipboardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  return (
    <div className="">
      <button onClick={handleCopy}>
        <img src={Copy} alt="Copy" className="h-6 w-6" />
      </button>
      {copied && (
        <span className="absolute right-[-70px] text-lg text-secondary">
          Copied!
        </span>
      )}
    </div>
  );
};
