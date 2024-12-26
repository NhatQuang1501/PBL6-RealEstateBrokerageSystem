import { useLocation, Link } from "react-router-dom";
import User from "../../assets/image/User.png";

const VerifyEmailForm = () => {
  const location = useLocation();
  const { email } = location.state || {};

  return (
    <div className=" font-montserrat">
      <form className="flex flex-col w-[28rem] bg-white shadow-lg rounded-2xl py-8 px-6 mx-auto items-center border border-gray-300 transition-transform duration-300 hover:shadow-2xl mt-10">
        <h2 className="font-bold text-2xl mb-5 text-blue-600">
          Xác minh tài khoản
        </h2>
        <img
          className="w-28 h-28 rounded-full border-4 border-blue-600 mb-6"
          src={User}
          alt="Verification"
        />
        <div className="flex flex-col items-center text-center space-y-6 w-full">
          <p className="text-gray-700 text-lg leading-relaxed">
            Vui lòng kiểm tra email{" "}
            <span className="font-semibold text-blue-500">{email}</span> và nhấn
            vào link trong email để kích hoạt tài khoản của bạn.
          </p>
          <Link
            to="/"
            className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md font-semibold text-lg transition-transform duration-300 hover:bg-blue-600 hover:scale-105"
          >
            Trở lại
          </Link>
          <div className="w-full border-t-2 border-dashed border-gray-300 my-4"></div>
          <p className="text-gray-500 text-sm">
            Không nhận được email?{" "}
            <span className="text-blue-500 cursor-pointer hover:underline">
              Gửi lại
            </span>
            .
          </p>
        </div>
      </form>
    </div>
  );
};

export default VerifyEmailForm;
