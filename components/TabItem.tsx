import { Dispatch, SetStateAction } from 'react';

interface TabItemProps {
  name: string;
  tabIdx: number;
  tab: number;
  setTab: Dispatch<SetStateAction<number>>;
}

export default function TabItem({ name, tabIdx, tab, setTab }: TabItemProps) {
  return (
    <button
      onClick={() => setTab(tabIdx)}
      className={`w-full max-w-[128px] cursor-pointer border-b-[3px] p-2 text-center font-semibold ${
        tab === tabIdx
          ? 'border-b-gray-600 dark:border-b-gray-300'
          : 'border-transparent text-gray-500 dark:text-gray-400'
      }`}
    >
      {name}
    </button>
  );
}
