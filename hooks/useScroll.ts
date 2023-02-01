import { useEffect, useRef, useState } from 'react';

export default function useScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [isScrollDown, setIsScrollDown] = useState(true);

  useEffect(() => {
    const element = ref.current!;
    let current = 0;

    function checkDirection() {
      const scrollH = element.scrollTop;

      if (scrollH > current) {
        setIsScrollDown(true);
      } else {
        setIsScrollDown(false);
      }

      current = scrollH;
    }

    element.addEventListener('scroll', checkDirection, false);

    return () => element.removeEventListener('scroll', checkDirection, false);
  }, []);

  return { ref, isScrollDown };
}
