import type React from "react";
import HomeLayout from "../../layouts/HomeLayout";
import Home from "../../components/home/Home";


const HomePage: React.FC = () => {
  return (
    <HomeLayout>
      <Home />
    </HomeLayout>
  );
};
export default HomePage;
