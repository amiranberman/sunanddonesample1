import Link from "next/link";
import React from "react";
import styles from "@/styles/step.module.scss";
import Section from "@/components/section";

interface StepProps {
  number?: string;
  title?: string;
  description?: string;
}

export const Step = (props: StepProps) => {
  return (
    <div className={styles.step}>
      <div className={styles.number}>{props.number}</div>
      <h2 className={styles.title}>{props.title}</h2>
      <p className={styles.description}>{props.description}</p>
    </div>
  );
};

interface StepsSectionProps {}

const StepsSection = (props: StepsSectionProps) => {
  return (
    <Section title="Three Simple Steps">
      <div className={styles.container}>
        <Step
          number="1"
          title="Home Address"
          description="Enter your home address and we’ll try our best to automatically gather the necessary information to provide you with an accurate quote."
        />
        <Step
          number="2"
          title="Bill Details"
          description="Next you’ll need to enter an estimation of your monthly or annual electicity bill. It’s helpful to have a bill from your utility company on hand for this step."
        />
        <Step
          number="3"
          title="Custom Quotes"
          description="Finally you’ll be presented quotes from various installers we’re partnered with. Once you’re satisfied with a quote you can schedule a consultation with us."
        />
      </div>
      <div className={styles.hr}>
        <div className={styles.or}>OR</div>
      </div>
      <div className={styles.consult}>
        <Link href="/contact">Schedule a consult</Link> to help you make the
        best decision for your home or business.
      </div>
    </Section>
  );
};

export default StepsSection;
