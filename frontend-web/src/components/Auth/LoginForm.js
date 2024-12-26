import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppProvider";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  let navigate = useNavigate();

  const { setSessionToken, setRole, setId, setName } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:8000/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSessionToken(data.tokens.access);
        setRole(data.role);
        const role = data.role;
        localStorage.setItem("refreshToken", data.tokens.refresh);
        console.log("Đăng nhập thành công!");
        console.log("Role: ", role);
        console.log("Ten: ", username);

        if (data.data && role === "admin") {
          setName(data.data.username);
          setId(data.user_id);
          console.log("Id: ", data.user_id);
        } else if (data.data && role === "user") {
          setName(data.data.user.username);
          setId(data.data.user_id);
        } else {
          console.error("Dữ liệu không hợp lệ:", data);
          setError("Dữ liệu người dùng không hợp lệ.");
        }

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "user") {
          navigate("/user/main-page-user");
        }
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error(error);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <div
      className="flex items-center w-full h-full justify-center bg-gray-200 font-montserrat m-auto relative"
      style={{
        backgroundImage: `url('https://ww1.prweb.com/prfiles/2015/03/02/12556168/Geneva_Q1_Facade.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        // filter: "blur(8px)",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex w-3/4 max-w-[50%] min-h-[30rem] m-auto bg-white shadow-2xl rounded-[2rem] overflow-hidden mt-30">
        {/* Left Section */}
        <div className="w-1/2 p-8 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-black mb-6 pb-10">
            Đăng nhập
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="username"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              id="password"
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-blue-600 block text-right mb-4"
            >
              Quên mật khẩu
            </a>
            <div className="flex flex-col items-center">
              <button
                className="bg-[#3CA9F9] text-white font-bold w-[110px] h-[35px] p-1 rounded-lg hover:bg-blue-600 transition duration-300"
                type="submit"
              >
                Đăng nhập
              </button>
            </div>
            <p
              className="text-red-500 pt-1 font-semibold text-center mt-5"
              
              dangerouslySetInnerHTML={{ __html: error }}
            ></p>
          </form>
        </div>

        <div className="w-1/2 bg-blue-500 text-white p-8 flex flex-col items-center justify-center rounded-tr-2xl rounded-br-2xl rounded-tl-[6rem] rounded-bl-[6rem] gap-[22px] text-center">
          <h2 className="text-2xl font-bold mb-4">Chào mừng trở lại</h2>
          <p className="mb-6 text-[14px]">
            Hãy đăng nhập để tiếp tục Hoặc đăng ký nếu bạn chưa có tài khoản
          </p>
          <button
            className="border-2 text-white border-solid border-white font-bold  w-[100px] h-[33px] rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={() => navigate("/authen/register")}
          >
            Đăng ký
          </button>
          <p className=" text-[12px]">Hoặc</p>
          <a href="/" className="underline text-[13px]">
            Quay lại trang chủ
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
