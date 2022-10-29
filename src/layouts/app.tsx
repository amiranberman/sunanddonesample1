import React, { useEffect } from "react";
import Head from "next/head";
import Header from "@/components/header";
import { useAppStore } from "@/stores/app";

type Props = {
  children: React.ReactNode;
};

const Layout = (props: Props) => {
  const { setHeaderHeight } = useAppStore();
  useEffect(() => {
    setHeaderHeight(
      document.querySelector("header")?.getBoundingClientRect().height!
    );
  }, [setHeaderHeight]);
  return (
    <>
      <Head>
        <title>Sun and Done</title>
        <meta name="description" content="Free instant solar quotes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {props.children}
    </>
  );
};

export default Layout;
