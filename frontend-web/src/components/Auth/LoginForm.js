/* eslint-disable jsx-a11y/anchor-is-valid */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppProvider";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  let navigate = useNavigate();

  const { setSessionToken, setRole, setId } = useAppContext();

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
        setSessionToken(data.access);
        setRole(data.role);
        setId(data.id);
        navigate("/");
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    }
    catch (error) {
      console.error(error);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  }



  return (
    <div className="flex items-center justify-center min-h-[50rem] bg-gray-200 font-montserrat">
      <div className="flex w-3/4 max-w-[50%] min-h-[43rem] bg-white shadow-2xl rounded-[2rem] overflow-hidden">
        {/* Thanh trái */}
        <div className="w-1/2 p-8 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-black mb-6 pb-10">
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
                className="bg-[#3CA9F9] text-white font-bold w-[100px] h-[33px] rounded-lg hover:bg-blue-600 transition duration-300"
                type="submit"
              >
                Đăng nhập
              </button>
            </div>
            <p
              className="text-red-500 pt-1 font-semibold "
              style={{
                height: "0.5rem",
              }}
              dangerouslySetInnerHTML={{ __html: error }}
            ></p>
          </form>
        </div>

        <div className="w-1/2 bg-[#3CA9F9] text-white p-8 flex flex-col items-center justify-center rounded-tr-2xl rounded-br-2xl rounded-tl-[6rem] rounded-bl-[6rem] gap-[22px] text-center">
          <h2 className="text-4xl font-bold mb-4">Chào mừng trở lại</h2>
          <p className="mb-6 text-[14px]">
            Hãy đăng nhập để tiếp tục Hoặc đăng ký nếu bạn chưa có tài khoản
          </p>
          <button
            className="border-2 text-white border-solid border-white font-bold  w-[100px] h-[33px] rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={() => navigate("/authen/register")}
          >
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
