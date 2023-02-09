import { useEffect, useState } from 'react';

export default function useCopy() {
  const [isCopied, setIsCopied] = useState(false);

  function copyToClipboard(TEXT: string) {
    navigator.clipboard.writeText(TEXT);
    setIsCopied(true);
  }

  useEffect(() => {
    const INTERVAL = setTimeout(() => setIsCopied(false), 1000);

    return () => clearInterval(INTERVAL);
  }, [isCopied]);

  return { isCopied, copyToClipboard };
}
