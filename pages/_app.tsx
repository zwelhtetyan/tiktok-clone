import { SessionProvider } from 'next-auth/react';
import Layout from '../components/Layout';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import useThemeStore from '../store/theme';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { setTheme } = useThemeStore();

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('');
    }
  }, [setTheme]);

  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
