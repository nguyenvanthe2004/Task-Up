import type React from "react";
import HomeLayout from "../../layouts/HomeLayout";
import Notification from "../../components/notifications/Notification";


const NotificationPage: React.FC = () => {
  return (
    <HomeLayout>
      <Notification />
    </HomeLayout>
  );
};
export default NotificationPage;
