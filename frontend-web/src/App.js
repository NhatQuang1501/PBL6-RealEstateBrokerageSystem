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

function App() {
  return (
    <div className=" id='app' className=" flex flex-col min-h-screen>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<TestView />} />
          <Route path="authen/login" element={<LoginPage />} />
          <Route path="authen/register" element={<SignUpPage />} />
          <Route path="authen/forgot-password" element={<ForgotPassword />} />

          <Route path="user/main-page-user" element={<MainPageUser />} />
          <Route path="user/detail-post/:id" element={<PostDetail />} />
          <Route path="user/create-post" element={<CreatePost />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
