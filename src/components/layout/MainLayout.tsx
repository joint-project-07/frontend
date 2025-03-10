import Header from "../common/Header";
import Footer from "../common/Footer";
import { Outlet } from "react-router-dom";

  const MainLayout: React.FC = () => {
    return (
    <>
      <Header />
      <Outlet /> 
      <Footer />
    </>
  );
};

export default MainLayout;