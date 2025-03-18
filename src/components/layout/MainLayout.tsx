import Header from "../common/Header";
import Footer from "../common/Footer";
import { Outlet } from "react-router-dom";
import styles from "../../style/MainLayout.module.scss"

  const MainLayout: React.FC = () => {
    return (
      <div className={styles.layoutContainer}>
      <Header />
      <main className={styles.content}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;