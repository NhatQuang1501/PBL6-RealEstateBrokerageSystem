

const SignUpForm = () => {
  return (
    <div className="flex items-center justify-center h-[80vh] w-[1000px] m-auto ">
      <div className="flex w-[800px] min-h-[30rem] bg-white shadow-2xl rounded-[2rem] overflow-hidden">
        {/* Thanh phải */}
        <div className="w-1/2 bg-[#4F91F5] text-white p-8 flex flex-col items-center text-center justify-center rounded-tr-[6rem] rounded-br-[6rem] gap-[22px]">
          <h2 className="text-2xl font-bold mb-4">Chào mừng người mới</h2>

          <p className="mb-6 text-[14px]">
            Hãy đăng ký tài khoản
            Hoặc đăng nhập nếu bạn đã có tài khoản
          </p>


          <button className="border-2 text-white border-solid bg-[#4F91F5] font-bold px-3 py-2  rounded-lg hover:bg-blue-600 transition duration-300">
            Đăng nhập
          </button>
        </div>

        {/* Thanh trái */}
        <div className="w-1/2 p-8 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-black pb-10">Đăng ký</h2>
          <form>
            <input
              type="email"
              placeholder="Nhập email"
              className="w-full text-[14px] px-2 py-3  mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full text-[14px] px-2 py-3  mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="w-full text-[14px] px-2 py-3  mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex flex-col items-center mt-5">
              <button className="bg-[#3CA9F9] text-white font-bold px-4 py-2  rounded-lg hover:bg-blue-600 transition duration-300">
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
