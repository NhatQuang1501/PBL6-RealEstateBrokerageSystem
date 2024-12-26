import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../AppProvider";
import Logo from "../../assets/image/Logo.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faChartLine,
  faEnvelope,
  faEdit,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import NotifyUser from "../Notification/NotifyUser";
import User from "../../assets/image/User.png";

function Header() {
  let navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const [ava, setAva] = useState("");

  const { sessionToken, setSessionToken, setRole, role, name } =
    useAppContext();
  const { id } = useAppContext();

  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLogout = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/auth/logout/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setSessionToken(null);
        setRole("");
        localStorage.removeItem("refreshToken");
        localStorage.clear();
        navigate("/");
      } else {
        console.error("Đăng xuất thất bại!");
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi đăng xuất:", error);
    }
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/auth/users-avatar/${id}/`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // if (response.data.avatar_url === null) {
        //   response.data.avatar_url =
        //     "https://th.bing.com/th/id/OIP.Kt4xItiSOKueszQh9UysdgAAAA?w=465&h=465&rs=1&pid=ImgDetMain";
        // }
        setAva(response.data.avatar_url);
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };
    fetchAvatar();
  }, [id]);

  useEffect(() => {
    setActiveLink(location.pathname); // Cập nhật activeLink khi đường dẫn thay đổi
  }, [location]);

  const linkStyle =
    "text-oxford-blue font-semibold hover:text-blue-400 transition duration-300";

  return (
    <>
      {role !== "user" && role !== "admin" ? (
        <div className="sticky top-0 h-[7vh] bg-white font-montserrat z-50 shadow-sm shadow-blue-100">
          <div className="main-content h-[7vh] w-screen px-3 flex items-center justify-between">
            <Link to="/" id="logo-header" className="flex items-center gap-1">
              <img className="w-[33px]" src={Logo} alt=""></img>
              <strong className="font-bold text-xl ml-2">SweetHome</strong>
            </Link>
            <nav className="flex items-center w-[60%] px-6">
              <ul className="flex space-x-6 gap-20">
                <li className="relative group">
                  <Link
                    to="/"
                    className={`${linkStyle} ${
                      activeLink === "/" ? "text-blue-400" : ""
                    }`}
                    onClick={() => setActiveLink("/")}
                  >
                    <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
                  </Link>
                  <span className="absolute transform -translate-x-1/2 mt-10 w-auto px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Trang chủ
                  </span>
                </li>

                <li className="relative group">
                  <Link
                    to="/authen/login"
                    className={`${linkStyle} ${
                      activeLink === "/authen/login" ? "text-blue-400" : ""
                    }`}
                    onClick={() => setActiveLink("/authen/login")}
                  >
                    <FontAwesomeIcon icon={faChartLine} className="w-5 h-5" />
                  </Link>
                  <span className="absolute transform -translate-x-1/2 mt-10 w-auto px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Dự đoán giá BĐS
                  </span>
                </li>
                <li className="relative group">
                  <Link
                    to="/authen/login"
                    className={`${linkStyle} ${
                      activeLink === "/authen/login" ? "text-blue-400" : ""
                    }`}
                    onClick={() => setActiveLink("/authen/login")}
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
                  </Link>
                  <span className="absolute transform -translate-x-1/2 mt-10 w-auto px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Giới thiệu
                  </span>
                </li>
                <li className="relative group">
                  <Link
                    to="/authen/login"
                    className={`${linkStyle} ${
                      activeLink === "/authen/login" ? "text-blue-400" : ""
                    }`}
                    onClick={() => setActiveLink("/authen/login")}
                  >
                    <FontAwesomeIcon icon={faEdit} className="w-5 h-5" />
                  </Link>
                  <span className="absolute transform -translate-x-1/2 mt-10 w-auto px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Đăng tin
                  </span>
                </li>
              </ul>
            </nav>
            <div>
              <button
                className="bg-blue-400 hover:bg-blue-500 w-[123px] px-2 py-2 font-semibold font-montserrat rounded-md text-white hidden md:block"
                onClick={() => navigate("/authen/login")}
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      ) : role === "user" ? (
        <div className="sticky top-0 h-[7vh] bg-white font-montserrat z-50 shadow-sm shadow-blue-100">
          <div className="main-content h-[7vh] w-screen px-3 flex items-center justify-between">
            <Link to="/" id="logo-header" className="flex items-center gap-1">
              <img className="w-[33px]" src={Logo} alt=""></img>
              <strong className="font-bold text-xl ml-2">SweetHome</strong>
            </Link>
            <nav className="flex items-center justify-center w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
              <ul className="flex space-x-4 gap-4 md:gap-6 lg:gap-12 xl:gap-20">
                <li className="relative group">
                  <Link
                    to="/user/main-page-user"
                    className={`${linkStyle} ${
                      activeLink === "/user/main-page-user"
                        ? "text-blue-400"
                        : ""
                    }`}
                    onClick={() => setActiveLink("/user/main-page-user")}
                  >
                    <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
                    {/* Fix sau */}
                  </Link>
                  <span className="absolute transform -translate-x-1/2 mt-10 w-auto px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Trang chủ
                  </span>
                </li>
                {/* <li>
                  <a
                    href="#!"
                    className={`${linkStyle} ${
                      activeLink === "/news" ? "text-blue-400" : ""
                    }`}
                    onClick={() => setActiveLink("/news")}
                  >
                    Tin tức
                  </a>
                </li> */}
                {/* <li className="relative group">
                  <Link
                    to="/news"
                    className={`${linkStyle} ${
                      activeLink === "/news" ? "text-blue-400" : ""
                    }`}
                    onClick={() => setActiveLink("/news")}
                  >
                    <FontAwesomeIcon icon={faNewspaper} className="w-5 h-5" />
                  </Link>
                  <span className="absolute transform -translate-x-1/2 mt-10 w-auto px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Tin tức
                  </span>
                </li> */}
                <li className="relative group">
                  <Link
                    to="/user/predict"
                    className={`${linkStyle} ${
                      activeLink === "/user/predict" ? "text-blue-400" : ""
                    }`}
                    onClick={() => setActiveLink("/user/predict")}
                  >
                    <FontAwesomeIcon icon={faChartLine} className="w-5 h-5" />
                  </Link>
                  <span className="absolute transform -translate-x-1/2 mt-10 w-auto px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Dự đoán giá BĐS
                  </span>
                </li>
                <li className="relative group">
                  <Link
                    to="/user/chat"
                    className={`${linkStyle} ${
                      activeLink === "/user/chat" ? "text-blue-400" : ""
                    }`}
                    onClick={() => setActiveLink("/user/chat")}
                  >
                    <FontAwesomeIcon icon={faComments} className="w-5 h-5" />
                  </Link>
                  <span className="absolute transform -translate-x-1/2 mt-10 w-auto px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Nhắn tin
                  </span>
                </li>
                {/* <li>
                  <Link
                    to="/user/create-post"
                    className={`${linkStyle} ${
                      activeLink === "/user/create-post" ? "text-blue-400" : ""
                    }`}
                    onClick={() => setActiveLink("/user/create-post")}
                  >
                    Đăng tin
                  </Link>
                </li> */}
                <li className="relative group">
                  <Link
                    to="/user/create-post"
                    className={`${linkStyle} ${
                      activeLink === "/user/create-post" ? "text-blue-400" : ""
                    }`}
                    onClick={() => setActiveLink("/user/create-post")}
                  >
                    <FontAwesomeIcon icon={faEdit} className="w-5 h-5" />
                  </Link>
                  <span className="absolute transform -translate-x-1/2 mt-10 w-auto px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Đăng tin
                  </span>
                </li>
              </ul>
            </nav>
            <div className="flex flex-row gap-5">
              <NotifyUser />
              <div className="flex items-center gap-4">
                <img
                  src={ava ? ava : User}
                  alt="avatar"
                  className="w-[2.5rem] h-[2.5rem] rounded-full border-[1px] border-gray-300 border-solid object-cover"
                />
                <Link to="/user/personal-page">
                  <p className="text-blue-400 font-semibold">{name}</p>
                </Link>
              </div>
              <button
                className="bg-custom_yellow w-[112px] px-1 py-1 font-semibold font-montserrat rounded-md bg-gray-400 text-white"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Header;
