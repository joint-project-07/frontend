import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import LoginModal from "../common/LoginModal";  
import { Outlet } from "react-router-dom";
import styles from "../../style/MainLayout.module.scss";

const MainLayout: React.FC = () => {
  return (
    <div className={styles.layoutContainer}>
      <Header />
      <LoginModal /> 
      <main className={styles.content}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;