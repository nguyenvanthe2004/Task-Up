import type React from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";

interface Props {
  children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="bg-background text-on-surface min-h-screen antialiased">
      <Header />
      <SideBar />
      {children}
    </div>
  );
};

export default HomeLayout;
