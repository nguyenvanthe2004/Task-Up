import type React from "react";
import HomeLayout from "../../layouts/HomeLayout";
import MySpace from "../../components/spaces/MySpace";


const MySpacePage: React.FC = () => {
  return (
    <HomeLayout>
      <MySpace />
    </HomeLayout>
  );
};
export default MySpacePage;
