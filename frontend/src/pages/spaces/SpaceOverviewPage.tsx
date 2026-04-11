import type React from "react";
import HomeLayout from "../../layouts/HomeLayout";
import SpaceOverview from "../../components/spaces/SpaceOverview";


const SpaceOverviewPage: React.FC = () => {
  return (
    <HomeLayout>
      <SpaceOverview />
    </HomeLayout>
  );
};
export default SpaceOverviewPage;
