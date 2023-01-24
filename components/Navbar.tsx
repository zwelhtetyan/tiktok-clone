import Image from 'next/image';
import Link from 'next/link';
import { CgMathPlus } from 'react-icons/cg';
import { IoSearchOutline } from 'react-icons/io5';
import { signIn, useSession } from 'next-auth/react';
import User from './User';

export default function Navbar() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <nav className='shadow'>
      <div className='flex justify-between items-center max-w-6xl mx-auto px-2 lg:px-4 py-2'>
        <Link href='/'>
          <Image
            src='/tiktik-logo.png'
            width={200}
            height={200}
            priority
            alt='logo'
            className='w-28 xs:w-32'
          />
        </Link>

        <div className='hidden md:flex items-center bg-gray-100 rounded-full overflow-hidden border border-transparent focus-within:border-gray-300 focus-within:bg-gray-200'>
          <input
            type='text'
            placeholder='Search accounts and videos'
            className='peer p-2 pl-4 border-none outline-none bg-transparent'
          />

          <div className='w-11 h-10 flex items-center justify-center border-l text-gray-400 border-l-gray-200 peer-focus:border-l-gray-300 cursor-pointer'>
            <IoSearchOutline size={23} />
          </div>
        </div>

        <div className='flex items-center'>
          <button className='rounded-full flex md:hidden items-center px-[5px] py-[5px] border bg-gray-200 text-gray-500 mx-2'>
            <IoSearchOutline size={23} />
          </button>

          {session && (
            <>
              <button className='flex items-center border border-gray-300 bg-gray-200 rounded px-4 py-[5px] mr-2'>
                <CgMathPlus />
                <p className='ml-2'>Upload</p>
              </button>

              <User />
            </>
          )}

          {!session && (
            <button
              onClick={() => signIn('google')}
              className='bg-primary text-white rounded px-4 py-[5px]'
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
