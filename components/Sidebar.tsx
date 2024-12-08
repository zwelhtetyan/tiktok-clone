import PopularTopics from './PopularTopics';
import { RiGithubFill, RiHomeSmileFill } from 'react-icons/ri';
import SuggestedAccounts from './SuggestedAccounts';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IoSearchOutline } from 'react-icons/io5';
import { useState } from 'react';
import MobileSearchBarModal from './modal/MobileSearchBarModal';

export default function Sidebar() {
  const [showMobileSearchBar, setShowMobileSearchBar] = useState(false);

  const router = useRouter();

  return (
    <aside className='side-bar hidden h-[calc(100vh-97px)] w-14 min-w-[3.5rem] overflow-hidden overflow-y-auto border-r border-r-gray-100 dark:border-r-darkBorder lg:flex lg:w-full lg:max-w-[21rem] lg:flex-col lg:border-none lg:pr-4'>
      <div>
        {showMobileSearchBar && (
          <MobileSearchBarModal onClose={() => setShowMobileSearchBar(false)} />
        )}

        <Link
          href='https://github.com/zwelhtetyan/tiktok-clone'
          target='_blank'
          aria-label='Home'
          className={`mb-2 flex h-12 w-12 max-w-[150px] items-center justify-center rounded-full bg-gray-100 text-sm dark:border-darkSecondary dark:bg-darkBtn lg:h-auto lg:w-auto lg:rounded-md lg:bg-primary lg:p-1 lg:text-white dark:lg:bg-primary`}
        >
          <RiGithubFill size={22} />
          <p className='hidden lg:ml-2 lg:block'>Stars on Github</p>
        </Link>

        <Link
          href='/'
          aria-label='Home'
          className={`${
            router.asPath === '/'
              ? 'bg-gray-200 text-primary dark:bg-black lg:border-primary'
              : 'border-gray-200 bg-gray-100 hover:border-gray-300 hover:bg-gray-200 dark:bg-darkBtn dark:text-white dark:hover:bg-darkBtnHover lg:bg-transparent dark:lg:bg-transparent'
          } flex h-12 w-12 items-center justify-center rounded-full border text-lg font-bold dark:border-darkSecondary lg:w-auto lg:justify-start lg:rounded-sm lg:border-none lg:p-2`}
        >
          <RiHomeSmileFill size={22} />
          <p className='hidden lg:ml-2 lg:block'>For You</p>
        </Link>

        <button
          aria-label='search'
          onClick={() => setShowMobileSearchBar(true)}
          className={`${
            false
              ? 'active-topic'
              : 'border-gray-200 bg-gray-100 hover:border-gray-300 hover:bg-gray-200 dark:bg-darkBtn dark:text-white dark:hover:bg-darkBtnHover'
          } mt-2 flex h-12 w-12 items-center justify-center rounded-full border focus-visible:outline-none dark:border-darkSecondary md:hidden lg:h-auto lg:w-auto lg:px-3 lg:py-2`}
        >
          <IoSearchOutline size={23} />
        </button>

        <div className='my-3 h-[1px] bg-gray-200 dark:bg-darkBorder' />

        <PopularTopics />
      </div>

      <div className='my-4 hidden h-[1] bg-gray-200 dark:bg-darkBorder lg:block' />

      <h2 className='mb-4 hidden font-semibold text-gray-500 dark:text-gray-400 lg:block'>
        Suggested accounts
      </h2>

      <SuggestedAccounts />
    </aside>
  );
}
