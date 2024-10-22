import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppProvider";
import Logo from "../../assets/image/Logo.png";
function Header() {

  let navigate = useNavigate();

  const { sessionToken, setSessionToken, setRole, role, name } = useAppContext();

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
        setSessionToken("");
        setRole("");
        localStorage.removeItem("refreshToken");
        navigate("/");
      } else {
        console.error("Đăng xuất thất bại!");
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi đăng xuất:", error);
    }
  };

  return (
    <>
      {!sessionToken && role !== "user" ? (
        <div className=" sticky top-0 h-[13vh] bg-white font-montserrat z-50">
          <div className="main-content h-[13vh] w-screen px-3 flex items-center justify-between ">
            <div id="logo-header" className="flex items-center gap-1">
              <img className="w-[33px] " src={Logo} alt=""></img>
              <strong className="font-bold text-base">SweetHome</strong>
            </div>
            <nav className="flex items-center w-[60%] px-6 ">
              <ul className="flex space-x-6 gap-10">
                <li>
                  <a
                    href="#!"
                    className="text-oxford-blue font-semibold hover:text-[#3CA9F9]"
                  >
                    Nhà đất
                  </a>
                </li>
                <li>
                  <a
                    href="#!"
                    className="text-oxford-blue font-semibold hover:text-[#3CA9F9]"
                  >
                    Tin tức
                  </a>
                </li>
                <li>
                  <a
                    href="#!"
                    className="text-oxford-blue font-semibold hover:text-[#3CA9F9]"
                  >
                    Hướng dẫn
                  </a>
                </li>
                <li>
                  <a
                    href="#!"
                    className="text-oxford-blue font-semibold hover:text-[#3CA9F9]"
                  >
                    Liên hệ
                  </a>
                </li>
                <li>
                  <Link
                    to="/authen/login"
                    className="text-oxford-blue font-semibold hover:text-[#3CA9F9]"
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
        <div className=" sticky top-0 h-[13vh] bg-white  font-montserrat z-50">
          <div className="main-content h-[13vh] w-screen px-3 flex items-center justify-between ">
            <div id="logo-header" className="flex items-center gap-1">
              <img className="w-[33px] " src={Logo} alt=""></img>
              <strong className="font-bold text-base">SweetHome</strong>
            </div>
            <nav className="flex items-center w-[60%] px-6 ">
              <ul className="flex space-x-6 gap-10">
                <li>
                  <a
                    href="#!"
                    className="text-oxford-blue font-semibold hover:text-[#3CA9F9]"
                  >
                    Nhà đất
                  </a>
                </li>
                <li>
                  <a
                    href="#!"
                    className="text-oxford-blue font-semibold hover:text-[#3CA9F9]"
                  >
                    Tin tức
                  </a>
                </li>
                <li>
                  <a
                    href="#!"
                    className="text-oxford-blue font-semibold hover:text-[#3CA9F9]"
                  >
                    Hướng dẫn
                  </a>
                </li>
                <li>
                  <a
                    href="#!"
                    className="text-oxford-blue font-semibold hover:text-[#3CA9F9]"
                  >
                    Liên hệ
                  </a>
                </li>
                <li>
                  <Link
                    to="/user/create-post"
                    className="text-oxford-blue font-semibold hover:text-[#3CA9F9]"
                  >
                    Đăng tin
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="flex flex-row gap-5">
              <div className="flex items-center gap-4">
                <img
                  src="https://th.bing.com/th/id/OIP.kWtj5f6Egn513Uoc8chstgHaHa?w=185&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7"
                  alt="avatar"
                  className="w-[2.5rem] h-[2.5rem] rounded-full border-2 border-[#3CA9F9] object-cover"
                />
                <p className="text-[#3CA9F9] font-semibold">{name}</p>
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
