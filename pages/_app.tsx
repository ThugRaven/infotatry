import { ChakraProvider } from '@chakra-ui/react';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import '../styles/globals.css';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  // return (
  //   <ChakraProvider>
  //     <Component {...pageProps} />
  //   </ChakraProvider>
  // );

  return (
    <ChakraProvider>{getLayout(<Component {...pageProps} />)}</ChakraProvider>
  );
}
