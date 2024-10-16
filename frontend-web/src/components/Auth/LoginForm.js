/* eslint-disable jsx-a11y/anchor-is-valid */

const LoginForm = () => {
  return (
    <div className="flex items-center justify-center h-[80vh] w-[1000px] m-auto">
      <div className="flex w-[800px] min-h-[30rem] bg-white shadow-2xl rounded-[2rem] overflow-hidden">
        {/* Thanh trái */}
        <div className="w-1/2 p-8 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-black mb-6 pb-10">
            Đăng nhập
          </h2>
          <form>
            <input
              type="email"
              placeholder="Email"
              className="w-full text-[14px] px-2 py-3 mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full text-[14px] px-2 py-3  mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <a
              href="#"
              className="text-[10px] text-gray-500 hover:text-blue-600 block text-right mb-4"
            >
              Quên mật khẩu
            </a>
            <div className="flex flex-col items-center">
              <button className="bg-[#3CA9F9] border-2 border-solid border-white text-white font-bold px-3 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                Đăng nhập
              </button>
            </div>
          </form>
        </div>

        <div className="w-1/2 bg-[#4F91F5] text-white p-8 flex flex-col items-center justify-center rounded-tr-2xl rounded-br-2xl rounded-tl-[6rem] rounded-bl-[6rem] gap-[22px] text-center">
          <h2 className="text-2xl font-bold mb-4">Chào mừng trở lại</h2>
          <p className="mb-6 text-[14px]">
            Hãy đăng nhập để tiếp tục
            Hoặc đăng ký nếu bạn chưa có tài khoản
          </p>   
          <button className="border-2 text-white border-solid border-white font-bold  px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Đăng ký
          </button>

        </div>
      </div>
    </div>
  );
};

export default LoginForm;
