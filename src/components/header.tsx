import React from "react";
import Image from "next/image";
import styles from "@/styles/header.module.scss";
import Button from "@/components/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import cx from "classnames";

type Props = {
  sticky?: boolean;
};

const Header = ({ sticky }: Props) => {
  const { data: session, status } = useSession();
  return (
    <header
      className={cx(styles.container, { [styles.sticky as string]: sticky })}
    >
      <Link href="/">
        <div
          style={{ width: "300px", aspectRatio: "4/1", position: "relative" }}
        >
          <Image
            src="/images/logo.png"
            alt="Sun and Done logo of a sun with a green checkmark"
            layout="fill"
            className={styles.logo}
          />
        </div>
      </Link>
      <div className={styles.buttons}>
        {status === "authenticated" ? (
          <>
            <div>Hi, {session?.user?.name?.split(" ")[0]}</div>
            <Button onClick={() => signOut()}>Sign out</Button>
          </>
        ) : (
          <>
            <Button onClick={() => signIn()}>Login</Button>
            <Button linkProps={{ href: "/register" }} secondary>
              Go Solar
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
