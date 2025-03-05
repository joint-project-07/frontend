import "./App.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UsersSignupForm from "./pages/UsersSignup";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/UsersSignup" element={<UsersSignupForm />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
