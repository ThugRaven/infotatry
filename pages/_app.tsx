import { ChakraProvider } from '@chakra-ui/react';
import AuthProvider from '@components/auth/AuthProvider';
import { SEO } from '@components/common';
import 'mapbox-gl/dist/mapbox-gl.css';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Analytics } from '@vercel/analytics/next';
import '../styles/globals.css';
import '../styles/reset.css';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

export default function MyApp({
  Component,
  pageProps: { ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <SEO>
        <meta
          key="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </SEO>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ChakraProvider>
            {getLayout(<Component {...pageProps} />)}
            <Analytics />
          </ChakraProvider>
        </AuthProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}
