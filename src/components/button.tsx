import React from "react";
import styles from "@/styles/button.module.scss";
import cx from "classnames/bind";
import Link, { LinkProps } from "next/link";

interface Props extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  secondary?: boolean;
  linkProps?: LinkProps;
  className?: string;
}


const Button = (props: Props) => {
  const { linkProps, className, secondary, ...buttonProps } = props;

  const classNames = cx(
    props.className,
    "inline-flex justify-center items-center py-2 px-4 whitespace-nowrap bg-orange font-semibold text-base cursor-pointer rounded-md sm:py-4 sm:px-5 lg:text-lg text-white",
    {
      [styles.secondary as string]: secondary,
    },
  );

  const baseButton = (
    <div className={classNames} {...buttonProps}>
      {props.children}
    </div>
  );

  if (linkProps) {
    return <Link {...linkProps}>{baseButton}</Link>;
  }
  return baseButton;
};

export default Button;
