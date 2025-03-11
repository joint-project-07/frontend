import React from "react";
import styles from "../../style/Footer.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.companyInfo}>
          <h3>회사 정보</h3>
          <p>대표: </p>
          <p>사업자 번호:</p>
        </div>
        <div className={styles.privacyPolicy}>
          <h3>개인정보 처리방침</h3>
          <a href="/privacy-policy">여기를 클릭</a>
        </div>
        <div className={styles.copyright}>
          <p>© 2025, Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;