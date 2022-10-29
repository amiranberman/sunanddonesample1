import React from "react";
import styles from "@/styles/section.module.scss";
import classnames from "classnames";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <section className={classnames(styles.section, className)}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        {children}
      </div>
    </section>
  );
};

export default Section;
