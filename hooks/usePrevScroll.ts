import { RefObject, useEffect } from 'react';
import useStore from '../store';

// restore => means restore current screen to previous scroll position
// keep => just keep previous scroll position in global state

export function useRestorePreviousScroll(ref: RefObject<HTMLElement | null>) {
  const { isRestore, prevScroll, setPrevScroll, setIsRestore } = useStore();

  useEffect(() => {
    if (!isRestore) return;

    const elem = ref?.current;
    if (!elem) return;

    elem.scrollTop = prevScroll;

    // reset scroll state after scroll
    setPrevScroll(0);
    setIsRestore(false);
  }, [isRestore, prevScroll, ref, setIsRestore, setPrevScroll]);
}

export function useSetPrevScroll(ref: RefObject<HTMLElement>) {
  const { setPrevScroll, setIsRestore } = useStore();

  function keepScrollBeforeNavigate() {
    const scrollHeight = ref?.current?.scrollTop || 0;
    setPrevScroll(scrollHeight);
    setIsRestore(false);
  }

  return { keepScrollBeforeNavigate };
}
