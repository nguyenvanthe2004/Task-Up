import type React from "react";
import HomeLayout from "../../layouts/HomeLayout";
import Member from "../../components/workspaces/Member";


const MemberPage: React.FC = () => {
  return (
    <HomeLayout>
      <Member />
    </HomeLayout>
  );
};
export default MemberPage;
