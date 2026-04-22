import type React from "react";
import HomeLayout from "../../layouts/HomeLayout";
import ListDetail from "../../components/lists/ListDetail";


const ListDetailPage: React.FC = () => {
  return (
    <HomeLayout>
      <ListDetail />
    </HomeLayout>
  );
};
export default ListDetailPage;
