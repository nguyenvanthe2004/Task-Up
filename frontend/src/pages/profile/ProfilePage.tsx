import type React from "react";
import HomeLayout from "../../layouts/HomeLayout";
import Profile from "../../components/profile/Profile";


const ProfilePage: React.FC = () => {
  return (
    <HomeLayout>
      <Profile />
    </HomeLayout>
  );
};
export default ProfilePage;
