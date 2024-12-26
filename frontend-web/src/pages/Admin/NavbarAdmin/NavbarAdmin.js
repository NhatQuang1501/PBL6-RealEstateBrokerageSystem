import React, { useState, useEffect } from "react";
import Logo from "../../../assets/image/Logo.png";
import Icon1 from "../../../assets/image/health.png";
import Icon2 from "../../../assets/image/clipboard-text.png";
import ArrowIcon from "../../../assets/image/Frame12.png";

const Navbar = ({ isCollapsed, toggleNavbar, handleMenuClick, activeMenu }) => {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const [reportMenuOpen, setReportMenuOpen] = useState(false);

  useEffect(() => {
    const savedActiveMenu = localStorage.getItem("activeMenu");
    if (savedActiveMenu) {
      handleMenuClick(savedActiveMenu);
    }
  }, [handleMenuClick]);

  const toggleAccountMenu = () => {
    setAccountMenuOpen(!accountMenuOpen);
  };

  const togglePostMenu = () => {
    setPostMenuOpen(!postMenuOpen);
  };

  const toggleReportMenu = () => {
    setReportMenuOpen(!reportMenuOpen);
  };

  const handleMenuClickWithStorage = (menu) => {
    handleMenuClick(menu);
    localStorage.setItem("activeMenu", menu);
  };

  return (
    <div
      className={` h-[98vh] bg-white text-[#6F767E] p-4 flex flex-col transition-width duration-300 rounded-xl ${
        isCollapsed ? "w-20" : "w-80"
      }`}
    >
      <div className="flex items-center justify-between mt-2">
        <div
          className={`flex items-center w-auto gap-3 ${
            isCollapsed ? "hidden" : "block"
          }`}
        >
          <img
            className={`h-8 w-10 ${isCollapsed ? "hidden" : "block"}`}
            src={Logo}
            alt="Logo"
          />
          <strong className="flex flex-col justify-between h-8">
            <p className="font-bold">Admin</p>
            <p className="font-bold">SweetHome</p>
          </strong>
        </div>

        <button onClick={toggleNavbar} className="text-white ">
          {isCollapsed ? (
            <div>
              <img
                src={ArrowIcon}
                className="w-[50px] scale-y-[-1] rotate-90"
                alt=""
              />
            </div>
          ) : (
            <div>
              <img src={ArrowIcon} className="w-[50px] rotate-90" alt="" />
            </div>
          )}
        </button>
      </div>
      <hr className="border-t-2 border-gray-300 my-5" />

      {/* Danh sách Navbar */}
      <ul className="mt-8 space-y-2">
        <li
          onClick={() => handleMenuClickWithStorage("dashboard")}
          className="flex items-center gap-12 navbar-item p-3 hover:bg-[#9EBBD8] rounded-xl cursor-pointer"
        >
          <img src={Icon1} className="w-[23px] h-[23px]" alt="" />
          <a
            href="#!"
            className={`block  rounded ${isCollapsed ? "hidden" : "block"}`}
          >
            Bảng điều khiển
          </a>
        </li>

        {/* Account */}
        <li>
          <button
            onClick={toggleAccountMenu}
            className="flex justify-between items-center cursor-pointer w-full p-3 hover:bg-[#9EBBD8] rounded-xl transition-all duration-300 ease-in-out"
          >
            <img
              onClick={() => handleMenuClickWithStorage("accountList")}
              src={Icon2}
              className="w-[23px] h-[23px]"
              alt=""
            />

            <span className={`block ${isCollapsed ? "hidden" : "block"}`}>
              Quản lý tài khoản
            </span>
            <span>
              {accountMenuOpen ? (
                <div>
                  <img
                    src={ArrowIcon}
                    className="w-[32px] scale-y-[-1]"
                    alt=""
                  />
                </div>
              ) : (
                <div>
                  <img src={ArrowIcon} className="w-[32px] " alt="" />
                </div>
              )}
            </span>
          </button>
          {accountMenuOpen && (
            <ul className="pl-4 mt-2 space-y-2 transition-all duration-300 ease-in-out">
              <li onClick={() => handleMenuClickWithStorage("accountList")}>
                <a
                  href="#!"
                  className={`block p-3 hover:bg-[#9EBBD8] rounded-xl ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                >
                  Danh sách tài khoản
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Post */}
        <li>
          <button
            onClick={togglePostMenu}
            className="flex justify-between cursor-pointer items-center w-full p-3 hover:bg-[#9EBBD8] rounded-xl"
          >
            <img
              onClick={() => handleMenuClickWithStorage("managePosts")}
              src={Icon2}
              className="w-[23px] h-[23px]"
              alt=""
            />
            <span className={`block ${isCollapsed ? "hidden" : "block"}`}>
              Quản lý bài đăng
            </span>
            <span>
              {postMenuOpen ? (
                <div>
                  <img
                    src={ArrowIcon}
                    className="w-[32px] scale-y-[-1]"
                    alt=""
                  />
                </div>
              ) : (
                <div>
                  <img src={ArrowIcon} className="w-[32px] " alt="" />
                </div>
              )}
            </span>
          </button>
          {postMenuOpen && (
            <ul className="pl-4 mt-2 space-y-2">
              <li onClick={() => handleMenuClickWithStorage("managePosts")}>
                <a
                  href="#!"
                  className={`block p-3 hover:bg-[#9EBBD8] rounded-xl ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                >
                  Danh sách bài đăng
                </a>
              </li>
              <li onClick={() => handleMenuClickWithStorage("browsePosts")}>
                <a
                  href="#!"
                  className={`block p-3 hover:bg-[#9EBBD8] rounded-xl ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                >
                  Duyệt bài đăng
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Report */}
        <li>
          <button
            onClick={toggleReportMenu}
            className="flex justify-between items-center cursor-pointer w-full p-3 hover:bg-[#9EBBD8] rounded-xl transition-all duration-300 ease-in-out"
          >
            <img
              onClick={() => handleMenuClickWithStorage("manageReports")}
              src={Icon2}
              className="w-[23px] h-[23px]"
              alt=""
            />

            <span className={`block ${isCollapsed ? "hidden" : "block"}`}>
              Quản lý báo cáo
            </span>
            <span>
              {reportMenuOpen ? (
                <div>
                  <img
                    src={ArrowIcon}
                    className="w-[32px] scale-y-[-1]"
                    alt=""
                  />
                </div>
              ) : (
                <div>
                  <img src={ArrowIcon} className="w-[32px] " alt="" />
                </div>
              )}
            </span>
          </button>
          {reportMenuOpen && (
            <ul className="pl-4 mt-2 space-y-2 transition-all duration-300 ease-in-out">
              <li onClick={() => handleMenuClickWithStorage("manageReports")}>
                <a
                  href="#!"
                  className={`block p-3 hover:bg-[#9EBBD8] rounded-xl ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                >
                  Danh sách báo cáo
                </a>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
