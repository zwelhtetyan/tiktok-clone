import Image from 'next/image';
import Link from 'next/link';
import { CgMathPlus } from 'react-icons/cg';
import { IoSearchOutline } from 'react-icons/io5';
import { signIn, useSession } from 'next-auth/react';
import User from './User';

export default function Navbar() {
  const { data: user }: any = useSession();

  return (
    <nav className='border-b border-b-[rgba(34,90,89,0.2)]'>
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
          <button className='btn-secondary rounded-full flex md:hidden items-center p-[5px] text-gray-500 mx-2'>
            <IoSearchOutline size={23} />
          </button>

          {user && (
            <>
              <Link
                href='/upload'
                className='btn-secondary flex items-center mr-2'
              >
                <CgMathPlus />
                <p className='ml-2'>Upload</p>
              </Link>

              <User />
            </>
          )}

          {!user && (
            <button onClick={() => signIn('google')} className='btn-primary'>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
