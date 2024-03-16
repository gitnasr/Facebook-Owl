import '@/styles/globals.css';

import { AppProps } from 'next/app';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextTopLoader />
      <Component {...pageProps} />
      <Toaster position='top-right' />
    </>
  );
}

export default MyApp;
