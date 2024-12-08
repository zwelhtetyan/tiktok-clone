import PopularTopics from './PopularTopics';
import { RiGithubFill, RiHomeSmileFill } from 'react-icons/ri';
import SuggestedAccounts from './SuggestedAccounts';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IoSearchCircle } from 'react-icons/io5';
import { useState } from 'react';
import MobileSearchBarModal from './modal/MobileSearchBarModal';
import { BiMenuAltLeft } from 'react-icons/bi';
import { closeSidebar, toggleSidebarDrawer } from '../utils/sidebar-drawer';
import { createPortal } from 'react-dom';

type OverlayProps = {
  onClose: () => void;
};
function Overlay({ onClose }: OverlayProps) {
  return (
    <div
      onClick={onClose}
      className='sidebar-overlay hide-sidebar-overlay fixed inset-0 z-20 h-screen w-screen bg-black opacity-50 transition-all lg:hidden'
    />
  );
}

export default function Sidebar() {
  const [showMobileSearchBar, setShowMobileSearchBar] = useState(false);

  const router = useRouter();

  return (
    <aside className='side-bar hide-sidebar fixed top-0 z-30 flex h-full w-full max-w-[21rem] flex-col overflow-hidden overflow-y-auto bg-white p-2 shadow dark:bg-dark lg:static lg:bg-transparent lg:p-0 lg:shadow-none'>
      {/* Sidebar drawer overlay */}
      {createPortal(<Overlay onClose={() => closeSidebar()} />, document?.body)}

      <div>
        {showMobileSearchBar && (
          <MobileSearchBarModal
            onClose={() => {
              setShowMobileSearchBar(false);
              closeSidebar();
            }}
          />
        )}

        <div className='mb-3 flex items-center gap-2'>
          <button
            onClick={toggleSidebarDrawer}
            className='mr-auto flex items-center justify-center rounded p-1 transition-colors hover:bg-gray-100 dark:hover:bg-darkBtnHover lg:hidden'
          >
            <BiMenuAltLeft size={30} />
          </button>

          <Link
            href='https://github.com/zwelhtetyan/tiktok-clone'
            target='_blank'
            aria-label='Home'
            className='flex max-w-[150px] items-center justify-center rounded-md bg-primary p-1 text-sm text-white hover:bg-primary/90 dark:border-darkSecondary dark:bg-darkBtn dark:hover:bg-darkBtnHover'
          >
            <RiGithubFill size={22} />
            <p className='ml-2'>Stars on Github</p>
          </Link>
        </div>

        <div className='flex gap-2'>
          <Link
            onClick={() => closeSidebar()}
            href='/'
            aria-label='Home'
            className={`${
              router.asPath === '/'
                ? 'bg-gray-100 text-primary dark:bg-black'
                : 'border-gray-200 bg-gray-100 hover:border-gray-300 hover:bg-gray-200 dark:bg-darkBtn dark:text-white dark:hover:bg-darkBtnHover'
            } flex w-full items-center justify-start rounded-sm border border-gray-200 p-2 text-lg font-bold dark:border-darkSecondary`}
          >
            <RiHomeSmileFill size={22} />
            <p className='ml-2'>For You</p>
          </Link>

          <button
            aria-label='search'
            onClick={() => setShowMobileSearchBar(true)}
            className='flex w-full items-center justify-start border border-gray-200 bg-gray-100 p-2 text-lg font-bold hover:border-gray-300 hover:bg-gray-200 focus-visible:outline-none dark:border-darkSecondary dark:bg-darkBtn dark:text-white dark:hover:bg-darkBtnHover md:hidden'
          >
            <IoSearchCircle size={25} />
            <p className='ml-2'>Search</p>
          </button>
        </div>

        <div className='my-4 h-[1px] bg-gray-200 dark:bg-darkBorder' />

        <PopularTopics />
      </div>

      <div className='my-4 h-[1px] bg-gray-200 dark:bg-darkBorder' />

      <h2 className='mb-4 font-semibold text-gray-500 dark:text-gray-400'>
        Suggested accounts
      </h2>
      <SuggestedAccounts />
    </aside>
  );
}
