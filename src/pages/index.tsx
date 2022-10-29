import StepsSection from "@/components/steps-section";
import MissionSection from "@/components/mission-section";
import Hero from "@/components/hero";
import { ReactElement } from "react";
import Layout from "@/layouts/app";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Hero />
      <StepsSection />
      <MissionSection />
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
