/* eslint-disable jsx-a11y/anchor-is-valid */

const SignUpForm = () => {
  return (
    <div className="flex items-center justify-center min-h-[50rem] bg-gray-200 font-montserrat">
      <div className="flex w-3/4 max-w-[50%] min-h-[30rem] bg-white shadow-2xl rounded-[2rem]  overflow-hidden">
        {/* Thanh phải */}
        <div className="w-1/2 bg-[#4F91F5] text-white p-8 flex flex-col items-center justify-center rounded-tr-[6rem] rounded-br-[6rem]">
          <h2 className="text-4xl font-bold mb-4">Chào mừng người mới</h2>
          <br />
          <br />
          <br />
          <p className="mb-6">
            Hãy đăng ký tài khoản
            <br />
            Hoặc đăng nhập nếu bạn đã có tài khoản
          </p>
          <br />
          <br />
          <br />

          <button className="bg-[#3CA9F9] text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300">
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
              <button className="bg-[#3CA9F9] text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300">
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
