import { useEffect, useState } from 'react';

export default function useCopy() {
  const [isCopied, setIsCopied] = useState(false);

  function copyToClipboard(TEXT: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(TEXT)
        .then(() => setIsCopied(true))
        .catch(() => setIsCopied(false));
    } else {
      fallbackCopyToClipboard(TEXT);
    }
  }

  function fallbackCopyToClipboard(TEXT: string) {
    const textArea = document.createElement("textarea");
    textArea.value = TEXT;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    } finally {
      document.body.removeChild(textArea);
    }
  }

  useEffect(() => {
    if (isCopied) {
      const INTERVAL = setTimeout(() => setIsCopied(false), 1000);
      return () => clearTimeout(INTERVAL);
    }
  }, [isCopied]);

  return { isCopied, copyToClipboard };
}
