import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../AppProvider";
import Logo from "../../assets/image/Logo.png";
import { useState, useEffect } from "react";
import axios from "axios";

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
        if (response.data.avatar_url === null) {
          response.data.avatar_url =
            "https://th.bing.com/th/id/OIP.Kt4xItiSOKueszQh9UysdgAAAA?w=465&h=465&rs=1&pid=ImgDetMain";
        }
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
    "text-oxford-blue font-semibold hover:text-[#3CA9F9] transition duration-300"; // Hiệu ứng transition

  return (
    <>
      {!sessionToken && role !== "user" ? (
        <div className="sticky top-0 h-[10vh] bg-white font-montserrat z-50 shadow-md shadow-blue-100 mb-5 rounded-b-[10rem]">
          <div className="main-content h-[10vh] w-screen px-3 flex items-center justify-between">
            <div id="logo-header" className="flex items-center gap-1">
              <img className="w-[33px]" src={Logo} alt=""></img>
              <strong className="font-extrabold text-base ml-2">
                SweetHome
              </strong>
            </div>
            <nav className="flex items-center w-[60%] px-6">
              <ul className="flex space-x-6 gap-10">
                <li>
                  <Link
                    to="/"
                    className={`${linkStyle} ${
                      activeLink === "/" ? "text-[#3CA9F9]" : ""
                    }`}
                    onClick={() => setActiveLink("/")}
                  >
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <a
                    href="#!"
                    className={`${linkStyle} ${
                      activeLink === "/news" ? "text-[#3CA9F9]" : ""
                    }`}
                    onClick={() => setActiveLink("/news")}
                  >
                    Tin tức
                  </a>
                </li>
                <li>
                  <a
                    href="#!"
                    className={`${linkStyle} ${
                      activeLink === "/guide" ? "text-[#3CA9F9]" : ""
                    }`}
                    onClick={() => setActiveLink("/guide")}
                  >
                    Dự đoán giá BĐS
                  </a>
                </li>
                <li>
                  <a
                    href="#!"
                    className={`${linkStyle} ${
                      activeLink === "/contact" ? "text-[#3CA9F9]" : ""
                    }`}
                    onClick={() => setActiveLink("/contact")}
                  >
                    Liên hệ
                  </a>
                </li>
                <li>
                  <Link
                    to="/authen/login"
                    className={`${linkStyle} ${
                      activeLink === "/authen/login" ? "text-[#3CA9F9]" : ""
                    }`}
                    onClick={() => setActiveLink("/authen/login")}
                  >
                    Đăng tin
                  </Link>
                </li>
              </ul>
            </nav>
            <div>
              <button
                className="bg-custom_yellow w-[123px] px-2 py-2 font-semibold font-montserrat rounded-md bg-[#3CA9F9] text-white"
                onClick={() => navigate("/authen/login")}
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="sticky top-0 h-[10vh] bg-white font-montserrat z-50 shadow-md shadow-blue-100 mb-5 rounded-b-[10rem]">
          <div className="main-content h-[10vh] w-screen px-3 flex items-center justify-between">
            <Link to="/" id="logo-header" className="flex items-center gap-1">
              <img className="w-[33px]" src={Logo} alt=""></img>
              <strong className="font-bold text-base ml-2">SweetHome</strong>
            </Link>
            <nav className="flex items-center w-[60%] px-6">
              <ul className="flex space-x-6 gap-10">
                <li>
                  <Link
                    to="/user/main-page-user"
                    className={`${linkStyle} ${
                      activeLink === "/user/main-page-user"
                        ? "text-[#3CA9F9]"
                        : ""
                    }`}
                    onClick={() => setActiveLink("/user/main-page-user")}
                  >
                    Bài đăng
                  </Link>
                </li>
                <li>
                  <a
                    href="#!"
                    className={`${linkStyle} ${
                      activeLink === "/news" ? "text-[#3CA9F9]" : ""
                    }`}
                    onClick={() => setActiveLink("/news")}
                  >
                    Tin tức
                  </a>
                </li>
                <li>
                  <a
                    href="#!"
                    className={`${linkStyle} ${
                      activeLink === "/guide" ? "text-[#3CA9F9]" : ""
                    }`}
                    onClick={() => setActiveLink("/guide")}
                  >
                    Dự đoán giá BĐS
                  </a>
                </li>
                <li>
                  <Link
                    to="/user/chat"
                    className={`${linkStyle} ${
                      activeLink === "/user/chat" ? "text-[#3CA9F9]" : ""
                    }`}
                    onClick={() => setActiveLink("/user/chat")}
                  >
                    Nhắn tin
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/create-post"
                    className={`${linkStyle} ${
                      activeLink === "/user/create-post" ? "text-[#3CA9F9]" : ""
                    }`}
                    onClick={() => setActiveLink("/user/create-post")}
                  >
                    Đăng tin
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="flex flex-row gap-5">
              <div className="flex items-center gap-4">
                <img
                  src={
                    ava
                      ? ava
                      : `https://th.bing.com/th/id/OIP.Kt4xItiSOKueszQh9UysdgAAAA?w=465&h=465&rs=1&pid=ImgDetMain`
                  }
                  alt="avatar"
                  className="w-[2.5rem] h-[2.5rem] rounded-full border-2 border-[#3CA9F9]  object-contain bg-gray-500"
                />
                <Link to="/user/personal-page">
                  <p className="text-[#3CA9F9] font-semibold">{name}</p>
                </Link>
              </div>
              <button
                className="bg-custom_yellow w-[123px] px-2 py-2 font-semibold font-montserrat rounded-md bg-[#3CA9F9] text-white"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;

