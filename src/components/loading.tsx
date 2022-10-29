import React from "react";
import { useAppStore } from "@/stores/app";
import styles from "@/styles/loading.module.scss";

type Props = {};

const Loading = (props: Props) => {
  const { loadingMessage } = useAppStore();
  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <img
          src="/images/loader.gif"
          width={150}
          height={150}
          alt="Sun loading animation"
        />
        <p>{loadingMessage}</p>
      </div>
    </div>
  );
};

export default Loading;
