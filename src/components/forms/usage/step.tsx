import React from "react";
import styles from "@/styles/layout-usage.module.scss";
import Head from "next/head";

type Props = {
  children: React.ReactNode;
  onClick: () => void;
  name: string;
  disabled?: boolean;
};

const Step = ({ name, children }: Props) => {
  return (
    <>
      <Head>
        <title>Sun and Done | {name}</title>
        <meta name="description" content="Free instant solar quotes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.navigation}></div>
          <div className={styles.title}>
            <h1>{name}</h1>
          </div>
        </div>
      </div>
      <div className={styles.usage}>{children}</div>
    </>
  );
};

export default Step;
