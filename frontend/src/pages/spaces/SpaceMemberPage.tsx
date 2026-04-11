import type React from "react";
import HomeLayout from "../../layouts/HomeLayout";
import SpaceMember from "../../components/spaces/SpaceMember";


const SpaceMemberPage: React.FC = () => {
  return (
    <HomeLayout>
      <SpaceMember />
    </HomeLayout>
  );
};
export default SpaceMemberPage;
