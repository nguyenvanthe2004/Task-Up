import type React from "react";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      {children}
    </div>
  );
};

export default AuthLayout;
