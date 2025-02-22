import { ReactNode } from 'react';
import Navbar from './Navbar';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });

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
    <div className='min-h-svh dark:bg-dark'>
      <Navbar hasSidebar={showSideBar} />

      <main
        style={{
          height:
            'calc(100vh - 54px - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        }}
        className='mx-auto flex w-full overflow-hidden overflow-y-auto px-2 py-4 lg:px-4'
      >
        {showSideBar && <Sidebar />}

        <div className='w-full flex-1'>{children}</div>
      </main>
    </div>
  );
}
