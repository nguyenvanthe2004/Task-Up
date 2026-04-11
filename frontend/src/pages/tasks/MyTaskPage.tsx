import type React from "react";
import HomeLayout from "../../layouts/HomeLayout";
import MyTask from "../../components/tasks/MyTask";


const MyTaskPage: React.FC = () => {
  return (
    <HomeLayout>
      <MyTask />
    </HomeLayout>
  );
};
export default MyTaskPage;
