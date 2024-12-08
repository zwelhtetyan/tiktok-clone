import { MouseEvent } from 'react';

type ClickEvent = MouseEvent<Element, globalThis.MouseEvent>;
type ClickHandler = (e: ClickEvent) => void;

type ClickFn = (
  singleClickHandler: ClickHandler,
  doubleClickHandler: ClickHandler,
  delay?: number,
) => ClickHandler;

export const videoClicker: ClickFn = (
  singleClickHandler,
  doubleClickHandler,
  delay = 250,
) => {
  let clickTime = 0;
  let interval: NodeJS.Timeout;

  return (e) => {
    clickTime++;

    if (clickTime === 1) {
      interval = setTimeout(() => {
        // single click

        clickTime = 0;

        singleClickHandler(e);
      }, delay);
    } else if (clickTime === 2) {
      // double click

      clearTimeout(interval);
      clickTime = 0;

      doubleClickHandler(e);
    }
  };
};
