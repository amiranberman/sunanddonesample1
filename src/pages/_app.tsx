// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "@/server/routers";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.scss";
import { ReactElement, ReactNode, useEffect } from "react";
import type { NextComponentType, NextPage } from "next";
import type { AppProps } from "next/app";
import { SSRProvider } from "react-aria";
import Layout from "@/layouts/app";
import Router from "next/router";
import { useAppStore } from "@/stores/app";
import Loading from "@/components/loading";
import ModalProvider from "mui-modal-provider";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const { loading, load, unload } = useAppStore();
  useEffect(() => {
    const start = () => {
      load("Hang tight...");
    };
    const done = () => {
      unload();
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", done);
    Router.events.on("routeChangeError", done);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", done);
      Router.events.off("routeChangeError", done);
    };
  }, [load, unload]);

  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  let component = <Component {...pageProps} />;
  if (loading) component = <Loading />;

  return (
    <SSRProvider>
      <SessionProvider session={session}>
        <ModalProvider>{getLayout(component)}</ModalProvider>
      </SessionProvider>
    </SSRProvider>
  );
}

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: {
        defaultOptions: {
          queries: { staleTime: 60, refetchOnWindowFocus: false },
        },
      },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp as NextComponentType);
