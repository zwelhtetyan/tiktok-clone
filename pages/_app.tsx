import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import NextNProgress from 'nextjs-progressbar';
import useStore from '../store';
import '../styles/globals.css';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { setTheme } = useStore();

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }

    document.body.classList.add('dark:bg-dark');
  }, [setTheme]);

  return (
    <SessionProvider session={session}>
      <NextNProgress
        color='rgb(254 44 85)'
        startPosition={0.1}
        stopDelayMs={100}
        height={3}
        options={{ showSpinner: false }}
      />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
