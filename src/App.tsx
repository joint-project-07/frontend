import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import MyPage from "./pages/Mypage";
import UsersSignupForm from "./pages/UsersSignup";
import ShelterSignupForm from "./pages/ShelterSignup";
import DetailPage from "./pages/DetailPage";
import SearchNotFound from "./pages/SearchNotFound";
import MainLayout from "./components/layout/MainLayout";
import { ModalProvider } from "./contexts/ModalContext";
import InstitutionScheduleList from "./pages/InstitutionScheduleList";
import InstitutionDetailPage from "./pages/InstitutionDetailPage";
import VolunteerScheduleRegistration from "./pages/VolunteerScheduleForm";
import FindId from "./pages/FindId";
import FindPassword from "./pages/FindPassward";
import KakaoCallbackPage from "./pages/kakaoCallback";
import AuthProvider from "./store/auth/authStore";

function App() {

  return (
    <AuthProvider>
      <ModalProvider>
        <Router>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/detail/:id" element={<DetailPage />} />
              <Route path="/MyPage" element={<MyPage />} />
              <Route path="/searchnotfound" element={<SearchNotFound />} />
              <Route
                path="/institution-schedule"
                element={<InstitutionScheduleList />}
              />
              <Route
                path="/institution-detail/:institutionId"
                element={<InstitutionDetailPage />}
              />
              <Route
                path="/schedule-registration"
                element={<VolunteerScheduleRegistration />}
              />
              <Route path="/find-id" element={<FindId />} />
              <Route path="/find-password" element={<FindPassword />} />
            </Route>
            <Route path="/UsersSignup" element={<UsersSignupForm />} />
            <Route path="/ShelterSignup" element={<ShelterSignupForm />} />
            <Route path="/auth/kakao/callback" element={<KakaoCallbackPage />} />
            {import.meta.env.DEV ? <Route path="test" element /> : null}
          </Routes>
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
