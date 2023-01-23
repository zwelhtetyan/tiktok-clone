import Image from 'next/image';
import Link from 'next/link';
import { CgMathPlus } from 'react-icons/cg';
import { IoSearchOutline } from 'react-icons/io5';

const Navbar = () => {
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
            className='w-32'
          />
        </Link>

        <div className='flex items-center bg-gray-100 rounded-full overflow-hidden border border-transparent focus-within:border-gray-300 focus-within:bg-gray-200'>
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
          <button className='flex items-center border border-gray-200 rounded px-4 py-[5px] mr-2'>
            <CgMathPlus />
            <p className='ml-2'>Upload</p>
          </button>
          <button className='bg-primary text-white rounded px-4 py-[5px]'>
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
