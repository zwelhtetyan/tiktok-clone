import Link from 'next/link';
import { CgMathPlus } from 'react-icons/cg';
import { IoSearchOutline } from 'react-icons/io5';
import { signIn, useSession } from 'next-auth/react';
import User from './User';
import LogoLight from '../utils/LogoLight';
import LogoDark from '../utils/LogoDark';
import { FormEvent, useRef } from 'react';
import { useRouter } from 'next/router';
import useStore from '../store';
import { BiMenuAltLeft } from 'react-icons/bi';
import { toggleSidebarDrawer } from '../utils/sidebar-drawer';

type Props = {
  hasSidebar: boolean;
};

export default function Navbar({ hasSidebar }: Props) {
  const { data: user }: any = useSession();

  const { theme } = useStore();
  const router = useRouter();

  const searchInputRef = useRef<HTMLInputElement>(null);

  function handleSearch(e: FormEvent) {
    e.preventDefault();

    const searchTerm = searchInputRef.current?.value!.trim();

    if (!searchTerm) return;

    router.push(`/search?q=${searchTerm}`);
  }

  return (
    <nav className='relative z-10 flex h-16 items-center justify-center border-b border-b-[rgba(34,90,89,0.2)] bg-white dark:border-b-darkBorder dark:bg-dark'>
      <div className='mx-auto flex w-full items-center justify-between gap-4 px-2 py-2 lg:px-4'>
        <Link
          href='/'
          aria-label='TikTok_logo'
          className={`${!hasSidebar ? 'block' : 'hidden lg:block'} `}
        >
          {theme === 'dark' ? <LogoDark /> : <LogoLight />}
        </Link>

        {hasSidebar && (
          <button
            onClick={toggleSidebarDrawer}
            className='flex items-center justify-center rounded p-1 transition-colors hover:bg-gray-100 dark:hover:bg-darkBtnHover lg:hidden'
          >
            <BiMenuAltLeft size={30} />
          </button>
        )}

        <form
          onSubmit={handleSearch}
          className='hidden w-full max-w-lg items-center justify-between overflow-hidden rounded-full border bg-gray-100 focus-within:border-gray-300 focus-within:bg-gray-200 dark:border-transparent dark:bg-darkSecondary dark:text-white dark:focus-within:border-gray-500 dark:focus-within:bg-darkSecondary md:flex'
        >
          <input
            ref={searchInputRef}
            defaultValue={router.query.q || ''}
            type='text'
            placeholder='Search accounts and videos'
            className='peer w-full flex-1 border-none bg-transparent p-2 pl-4 outline-none dark:placeholder-gray-500'
          />

          <button
            type='submit'
            className='flex h-10 w-11 cursor-pointer items-center justify-center border-l border-l-gray-200 text-gray-400 peer-focus:border-l-gray-300 dark:border-l-gray-500 dark:peer-focus:border-l-gray-500'
          >
            <IoSearchOutline size={23} />
          </button>
        </form>

        <div className='flex items-center'>
          {user ? (
            <>
              <Link
                href='/upload'
                className='btn-secondary mr-2 flex items-center'
              >
                <CgMathPlus />
                <p className='ml-2'>Upload</p>
              </Link>

              <User />
            </>
          ) : (
            <button onClick={() => signIn('google')} className='btn-primary'>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
