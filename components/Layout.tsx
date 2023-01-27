import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />

      <main className='flex max-w-6xl mx-auto px-2 lg:px-4 py-4 h-[calc(100vh-64px)] overflow-hidden'>
        <Sidebar />

        <div className='w-full pl-2 lg:pl-4'>{children}</div>
      </main>
    </>
  );
}
