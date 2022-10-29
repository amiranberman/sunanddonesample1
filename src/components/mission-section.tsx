import React from "react";
import Image from "next/image";
import Section from "@/components/section";
import styles from "@/styles/mission-section.module.scss";

interface MissionSectionProps {}

const MissionSection = (props: MissionSectionProps) => {
  return (
    <Section
      title="Solar for everyone, customized for you"
      className={styles.section}
    >
      <div className={styles.container}>
        <p>
          We believe everyone deserves cleaner, cheaper energy in the form of
          solar. Our mission is to make that a reality.
          <br />
          <br />
          We know the best way to introduce home and business owners to a
          greener future is through financial incentive.
          <br />
          <br />
          Sun and Done’s unique free tool offers a fully transparent view of
          solar pricing. We’ve finetuned our models to give you the most
          accurate, affordable quotes possible.
        </p>
      </div>
    </Section>
  );
};

export default MissionSection;
