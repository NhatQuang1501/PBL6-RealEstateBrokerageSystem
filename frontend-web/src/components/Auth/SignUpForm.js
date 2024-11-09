import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [error, setError] = useState(null);
  let navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Nhập đúng mật khẩu xác nhận");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
          email: email,
          username: username,
          password: password,
          role: "user",
          },
        }),
      });

      const data = await response.json();
      console.log(response);

      if (response.ok) {
        navigate("/authen/verify-email", { state: { email: email } });
        // console.log(data);
      } else {
        setError(data.message || "Đã tồn tại người dùng có tên đăng nhập này");
      }
    } catch (error) {
      console.log(error);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <div
      className="flex items-center w-full h-full justify-center bg-gray-200 font-montserrat m-auto relative"
      style={{
        backgroundImage: `url('https://static.chotot.com/storage/chotot-kinhnghiem/nha/2021/12/b039cc56-ban-dat-1-e1638373452143.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        // filter: "blur(8px)",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex w-3/4 max-w-[50%] min-h-[30rem] bg-white shadow-2xl rounded-[2rem] overflow-hidden mt-30">
        {/* Thanh phải */}
        <div className="w-1/2 bg-[#4F91F5] text-white p-8 flex flex-col items-center text-center justify-center rounded-tr-[6rem] rounded-br-[6rem] gap-[22px]">
          <h2 className="text-2xl font-bold mb-4">Chào mừng người mới</h2>

          <p className="mb-6 text-[14px]">
            Hãy đăng ký tài khoản Hoặc đăng nhập nếu bạn đã có tài khoản
          </p>

          <button
            className="border-2 text-white border-solid border-white font-bold  w-[110px] h-[35px] rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={() => navigate("/authen/login")}
          >
            Đăng nhập
          </button>
          <p className=" text-[12px]">Hoặc</p>
          <a href="/" className="underline text-[13px]">
            Quay lại trang chủ
          </a>
        </div>

        {/* Thanh trái */}
        <div className="w-1/2 p-8 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-black mb-5">Đăng ký</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Nhập email"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="username"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder="Nhập tên đăng nhập"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Nhập mật khẩu"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              name="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirm(e.target.value);
                setError("");
              }}
              placeholder="Nhập lại mật khẩu"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="flex flex-col items-center">
              <button
                className="bg-[#3CA9F9] text-white font-bold w-[100px] h-[33px] rounded-lg hover:bg-blue-600 transition duration-300 mt-1"
                type="submit"
              >
                Đăng ký
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
