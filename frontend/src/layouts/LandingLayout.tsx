import type React from "react";
import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";

interface Props {
  children: React.ReactNode;
}

const LandingLayout: React.FC<Props> = ({ children }) => {
  return (
    <body className="bg-background font-body text-on-background antialiased">
      <Header />
      {children}
      <Footer />
    </body>
  );
};

export default LandingLayout;
