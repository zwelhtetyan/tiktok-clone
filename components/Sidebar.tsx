import PopularTopics from './PopularTopics';
import { RiHomeSmileFill } from 'react-icons/ri';
import SuggestedAccounts from './SuggestedAccounts';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className='max-w-sm w-full border-r border-r-red-400 pr-4'>
      <Link
        href='/'
        className='w-full flex items-center px-3 py-2 rounded-sm text-xl font-bold text-[#F51997] hover:bg-gray-200'
      >
        <RiHomeSmileFill size={23} />
        <p className='ml-2'>For You</p>
      </Link>

      <div className='h-[1px] bg-gray-200 my-3' />

      <PopularTopics />

      <SuggestedAccounts />
    </aside>
  );
};

export default Sidebar;
