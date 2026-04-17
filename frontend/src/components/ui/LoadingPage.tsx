import React from "react";
import { Loader } from "lucide-react";

const LoadingPage: React.FC = () => {
  return (
    <div
      className="flex items-center justify-center w-full"
      style={{ height: "60vh" }}
    >
      <Loader size={40} className="animate-spin text-gray-500" />
    </div>
  );
};

export default LoadingPage;
