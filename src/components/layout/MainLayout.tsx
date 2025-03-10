import Header from "../common/Header";
import Footer from "../common/Footer";
import { Outlet } from "react-router-dom";

interface MainLayoutProps {
  }

  const MainLayout: React.FC<MainLayoutProps> = () => {
    return (
    <>
      <Header />
      <Outlet /> 
      <Footer />
    </>
  );
};

export default MainLayout;