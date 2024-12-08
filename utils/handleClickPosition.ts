import { MouseEvent } from 'react';

export const handleClickPosition = (
  e: MouseEvent<Element, globalThis.MouseEvent>,
) => {
  const rect = e.currentTarget?.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  return { x, y };
};
