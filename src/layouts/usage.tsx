import React from "react";
import Head from "next/head";
import styles from "@/styles/layout-usage.module.scss";

type Props = {
  children: React.ReactNode;
};

const Layout = (props: Props) => {
  return (
    <>
      <Head>
        <title>Sun and Done | Usage</title>
        <meta name="description" content="Free instant solar quotes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.title}>
            <h1>Usage</h1>
          </div>
        </div>
      </div>
      {props.children}
    </>
  );
};

export default Layout;
