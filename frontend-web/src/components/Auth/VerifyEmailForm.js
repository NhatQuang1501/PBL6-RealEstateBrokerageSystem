import { useLocation, Link } from "react-router-dom";

const VerifyEmailForm = () => {
  const location = useLocation();
  const { email } = location.state || {};

  return (
    <form className="flex flex-col w-[25rem] bg-gray-200 ml-auto mr-auto items-center rounded-xl py-12 border-2 border-[#002182]">
      <h2 className="font-bold text-2xl mb-3">Xác minh tài khoản</h2>
      <img
        className="w-[120px] h-[120px]"
        src={
          "https://scontent-hkg1-1.xx.fbcdn.net/v/t39.30808-6/464149342_944148107737727_822534148512675894_n.jpg?stp=dst-jpg_p180x540&_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=DdEvIMHG4l4Q7kNvgGVlRNd&_nc_zt=23&_nc_ht=scontent-hkg1-1.xx&_nc_gid=AFzPXNRYjJ6_UGApnt2wZoX&oh=00_AYAJVmuHYWfnrnKtDUMnoHvB5eNDhj53aXCkEwgky4IKjQ&oe=671AFFB2"
        }
        alt="a"
      />
      <div className="flex gap-5 flex-col w-[100%] items-center">
        <p className="w-[80%] text-center">
          Vui lòng kiểm tra email{" "}
          <span className="font-bold text-blue-700">{email}</span> của bạn và
          nhấn vào link để kích hoạt tài khoản của bạn
        </p>
        <Link
          to="/"
          className="bg-custom_yellow px-5 py-2 rounded-xl mt-3 font-bold"
        >
          Trở lại
        </Link>
        <hr className="w-[60%] mx-auto border-t-2 border-dashed border-black" />
      </div>
    </form>
  );
};

export default VerifyEmailForm;
