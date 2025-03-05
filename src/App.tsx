import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import LoginModal from "./components/common/LoginModal";
import { useState } from "react";

const MainPage: React.FC<{ showModal: boolean; onClose: () => void }> = ({
  showModal,
  onClose,
}) => {
  return (
    <>
      <Header />
      <main>
        <h1>메인 컨텐츠 영역</h1>
      </main>

      {/* 로그인 모달이 showModal이 true일 때만 뜨도록 설정 */}
      {showModal && <LoginModal onClose={onClose} />}

      <Footer />
    </>
  );
};

function App() {
  const [showModal, setShowModal] = useState(true); // 모달을 바로 표시하도록 설정

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              showModal={showModal}
              onClose={() => setShowModal(false)}
            />
          }
        />
        <Route
          path="/login"
          element={
            <MainPage
              showModal={showModal}
              onClose={() => setShowModal(false)}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
