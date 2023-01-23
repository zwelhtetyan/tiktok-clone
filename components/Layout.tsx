import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Navbar />

      <div className='flex max-w-6xl mx-auto px-2 lg:px-4 py-4'>
        <Sidebar />

        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
