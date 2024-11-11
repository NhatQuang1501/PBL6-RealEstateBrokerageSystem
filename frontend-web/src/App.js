import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/Header/header";
import Footer from "./components/Footer/footer";
import MainPageUser from "./pages/user/MainPageUser";
// import TestView from "./pages/user/TestView";
import PostDetail from "./pages/user/PostDetail";
import LoginPage from "./pages/authen/LoginPage";
import SignUpPage from "./pages/authen/SignUpPage";
import ForgotPassword from "./pages/authen/ForgotPassword";
import CreatePost from "./pages/user/CreatePost";
import VerifyEmail from "./pages/authen/VerifyEmail";
import AppProvider from "./AppProvider";
import Adminpage from "./pages/Admin/Adminpage/Adminpage";
import HeroPage from "./components/HeroPage/heropage";
import Error from "./components/error/error";

import PersonalProfile from "./pages/user/PersonalProfile";

import ChatPage from "./components/ChatBox/ChatPage";

import UpdatePost from "./pages/user/UpdatePost";
import UpdateProfile from "./pages/user/UpdateProfile";
import UploadImage from "./pages/user/UploadImage";
import { useState } from "react";
import ViewPersonProfile from "./pages/user/ViewPersonProfile";

function App() {
  const [searchValue, setSearchValue] = useState("");
  const [filterStatusValue, setFilterStatusValue] = useState("");
  const [filterPriceValue, setFilterPriceValue] = useState("");
  const [filterAreaValue, setFilterAreaValue] = useState("");
  const [typePost, setTypePost] = useState("");

  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#fafffe] via-[#e0f7fa] to-[#b2ebf2]">
        <Router>
          <Routes>
            {/* User */}
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <HeroPage
                    setSearchValue={setSearchValue}
                    setFilterStatusValue={setFilterStatusValue}
                    setFilterPriceValue={setFilterPriceValue}
                    setFilterAreaValue={setFilterAreaValue}
                    setTypePost={setTypePost}
                  />
                  <MainPageUser
                    searchValue={searchValue}
                    filterStatusValue={filterStatusValue}
                    filterPriceValue={filterPriceValue}
                    filterAreaValue={filterAreaValue}
                    typePost={typePost}
                  />
                  <Footer />
                </>
              }
            />
            <Route path="authen/login" element={<LoginPage />} />
            <Route path="authen/register" element={<SignUpPage />} />
            <Route
              path="authen/forgot-password"
              element={
                <>
                  <Header />
                  <ForgotPassword />
                  <Footer />
                </>
              }
            />
            <Route
              path="authen/verify-email"
              element={
                <>
                  <Header />
                  <VerifyEmail />
                  <Footer />
                </>
              }
            />

            <Route
              path="user/main-page-user"
              element={
                <>
                  <Header />
                  <HeroPage
                    setSearchValue={setSearchValue}
                    setFilterStatusValue={setFilterStatusValue}
                    setFilterPriceValue={setFilterPriceValue}
                    setFilterAreaValue={setFilterAreaValue}
                    setTypePost={setTypePost}
                  />
                  <MainPageUser
                    searchValue={searchValue}
                    filterStatusValue={filterStatusValue}
                    filterPriceValue={filterPriceValue}
                    filterAreaValue={filterAreaValue}
                    typePost={typePost}
                  />
                  <Footer />
                </>
              }
            />
            <Route
              path="user/detail-post/:postId"
              element={
                <>
                  <Header />
                  <PostDetail />
                  <Footer />
                </>
              }
            />
            <Route
              path="user/create-post"
              element={
                <>
                  <Header />
                  <CreatePost />
                  <Footer />
                </>
              }
            />

            <Route
              path="user/update-post/:postId"
              element={
                <>
                  <Header />
                  <UpdatePost />
                  <Footer />
                </>
              }
            />

            <Route
              path="user/personal-page"
              element={
                <>
                  <Header />
                  <PersonalProfile />
                  <Footer />
                </>
              }
            />
            <Route
              path="user/update-profile"
              element={
                <>
                  <Header />
                  <UpdateProfile />
                  <Footer />
                </>
              }
            />
            <Route
              path="/upload-image/:postId"
              element={
                <>
                  <Header />
                  <UploadImage />
                  <Footer />
                </>
              }
            />

            <Route
              path="user/chat-box"
              element={
                <>
                  <ChatPage />
                </>
              }
            />

            <Route
              path="user/profile/:userId"
              element={
                <>
                  <Header />
                  <ViewPersonProfile />
                  <Footer />
                </>
              }
            />

            {/* Admin*/}
            <Route path="admin/dashboard" element={<Adminpage />} />

            <Route path="*" element={<Error />} />
          </Routes>
        </Router>
      </div>
    </AppProvider>
  );
}

export default App;
