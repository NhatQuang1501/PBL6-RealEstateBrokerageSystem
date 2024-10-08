

const SignUpForm = () => {
  return (
    <div className="flex items-center justify-center min-h-[50rem] bg-gray-200 font-montserrat">
      <div className="flex w-3/4 max-w-[50%] min-h-[43rem] bg-white shadow-2xl rounded-[2rem] overflow-hidden">
        {/* Thanh phải */}
        <div className="w-1/2 bg-[#4F91F5] text-white p-8 flex flex-col items-center text-center justify-center rounded-tr-[6rem] rounded-br-[6rem] gap-[22px]">
          <h2 className="text-4xl font-bold mb-4">Chào mừng người mới</h2>

          <p className="mb-6 text-[14px]">
            Hãy đăng ký tài khoản
            Hoặc đăng nhập nếu bạn đã có tài khoản
          </p>


          <button className="border-2 text-white border-solid border-white font-bold  w-[100px] h-[33px] rounded-lg hover:bg-blue-600 transition duration-300">
            Đăng nhập
          </button>
        </div>

        {/* Thanh trái */}
        <div className="w-1/2 p-8 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-black mb-6 pb-10">Đăng ký</h2>
          <form>
            <input
              type="email"
              placeholder="Nhập email"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex flex-col items-center">
              <button className="bg-[#3CA9F9] text-white font-bold w-[100px] h-[33px] rounded-lg hover:bg-blue-600 transition duration-300">
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
