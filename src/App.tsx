import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import LandingPage from "./pages/LandingPage";
import MyPage from "./pages/Mypage";
import UsersSignupForm from "./pages/UsersSignup";

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/UsersSignup" element={<UsersSignupForm />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
