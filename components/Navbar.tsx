import Image from 'next/image';
import Link from 'next/link';

type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className='shadow'>
      <div className='max-w-7xl mx-auto px-2 lg:px-4 py-2'>
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
      </div>
    </nav>
  );
};

export default Navbar;
