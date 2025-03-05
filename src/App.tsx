import "./App.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserSignupForm from "./pages/UserSignup";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/UserSignup" element={<UserSignupForm />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
