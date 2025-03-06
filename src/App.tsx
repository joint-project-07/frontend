import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import LandingPage from "./pages/LandingPage";
import MyPage from "./pages/Mypage";
import UsersSignupForm from "./pages/UsersSignup";
import { AuthProvider } from "./contexts/AuthContext";
import DetailPage from "./pages/DetailPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="/MyPage" element={<MyPage />} />
            <Route path="/UsersSignup" element={<UsersSignupForm />} />
            <Route path="/DetailPage" element={<DetailPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
