import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useRouter } from 'next/router';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const { pathname } = useRouter();

  const homeRoute = pathname === '/';
  const profileRoute = pathname === '/profile/[id]';
  const searchRoute = pathname === '/search';

  const showSideBar = homeRoute || profileRoute || searchRoute;

  return (
    <div className='dark:bg-dark'>
      <Navbar />

      <main className='flex max-w-6xl mx-auto px-2 lg:px-4 py-4 h-[calc(100vh-64px)] overflow-y-auto overflow-hidden'>
        {showSideBar && <Sidebar />}

        <div className='w-full flex-1'>{children}</div>
      </main>
    </div>
  );
}
