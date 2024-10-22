import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/Header/header";
import Footer from "./components/Footer/footer";
import MainPageUser from "./pages/user/MainPageUser";
import TestView from "./pages/user/TestView";
import PostDetail from "./pages/user/PostDetail";
import LoginPage from "./pages/authen/LoginPage";
import SignUpPage from "./pages/authen/SignUpPage";
import ForgotPassword from "./pages/authen/ForgotPassword";
import CreatePost from "./pages/user/CreatePost";
import VerifyEmail from "./pages/authen/VerifyEmail";
import AppProvider from "./AppProvider";
import Adminpage from "./pages/Admin/Adminpage/Adminpage";

function App() {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen">
        <Router>
          <Routes>
            {/* User */}
            <Route path="/" element={<><Header /><TestView /><Footer /></>} />
            <Route path="authen/login" element={<LoginPage />} />
            <Route path="authen/register" element={<SignUpPage />} />
            <Route path="authen/forgot-password" element={<><Header /><ForgotPassword /><Footer /></>} />
            <Route path="authen/verify-email" element={<><Header /><VerifyEmail /><Footer /></>} />

            <Route path="user/main-page-user" element={<><Header /><MainPageUser /><Footer /></>} />
            <Route path="user/detail-post/:id" element={<><Header /><PostDetail /><Footer /></>} />
            <Route path="user/create-post" element={<><Header /><CreatePost /><Footer /></>} />

            {/* Admin*/}
            <Route path="admin/dashboard" element={<Adminpage />} />
          </Routes>
        </Router>
      </div>
    </AppProvider>
  );
}

export default App;
