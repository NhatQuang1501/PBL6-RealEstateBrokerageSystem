/* eslint-disable jsx-a11y/anchor-is-valid */

const LoginForm = () => {
  return (
    <div className="flex items-center justify-center min-h-[50rem] bg-gray-100 font-montserrat">
      <div className="flex w-3/4 max-w-[50%] min-h-[30rem] bg-white shadow-md rounded-[2rem] overflow-hidden">
        {/* Thanh trái */}
        <div className="w-1/2 p-8 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-black mb-6 pb-10">Đăng nhập</h2>
          <form>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <a href="#" className="text-sm text-gray-500 hover:text-blue-600 block text-right mb-4">
              Quên mật khẩu
            </a>
            <div className="flex flex-col items-center">
                <button className="bg-[#3CA9F9] text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300">
                    Đăng nhập
                </button>
            </div>
          </form>
        </div>

        {/* Thanh phải */}
        <div className="w-1/2 bg-[#4F91F5] text-white p-8 flex flex-col items-center justify-center rounded-tr-2xl rounded-br-2xl rounded-tl-[6rem] rounded-bl-[6rem]">
          <h2 className="text-4xl font-bold mb-4">Chào mừng quay trở lại</h2>
          <br/>
          <br/>
          <br/>
          <p className="mb-6">
            Hãy đăng nhập để tiếp tục
            <br />
            Hoặc đăng ký nếu bạn chưa có tài khoản
          </p>
          <br/>
          <br/>
          <br/>
          
          <button className="bg-[#3CA9F9] text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300">
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
