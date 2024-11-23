import { useEffect, useRef, useState } from 'react';

export const useCheckOverflow = <T extends HTMLElement>() => {
  const [isOverflow, setIsOverflow] = useState(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const checkOverflow = () => {
      const { scrollHeight, offsetHeight } = node;
      setIsOverflow(scrollHeight > offsetHeight);
    };

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(node);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { ref, isOverflow };
};
