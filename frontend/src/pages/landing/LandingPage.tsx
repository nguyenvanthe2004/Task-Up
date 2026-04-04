import type React from "react";
import LandingLayout from "../../layouts/LandingLayout";
import Landing from "../../components/landing/Landing";

const LandingPage: React.FC = () => {
  return (
    <LandingLayout>
      <Landing />
    </LandingLayout>
  );
};
export default LandingPage;
