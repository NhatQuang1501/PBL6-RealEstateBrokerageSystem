import Logo from "../../assets/image/Logo.png";
function Header() {
  return (
    <div className="h-[15vh] w-screen px-28 flex items-center justify-between">
      <a href="/" id="logo-header" className="flex flex-col">
        <img src={Logo} alt="Logo" className="" />
        <div className="text-[#3CA9F9] font-bold font-montserrat text-[1.3rem]">
          Sweet Home
        </div>
      </a>

      <div className="pb-4">
        <ul className="flex pr-[12rem] font-montserrat text-[1.2rem] font-semibold">
          <li className="mx-6 pr-10 cursor-pointer hover:text-[#3CA9F9] transition duration-300 delay-100 flex items-center justify-center h-12">
            Nhà đất bán
          </li>
          <li className="mx-6 pr-10 cursor-pointer hover:text-[#3CA9F9] transition duration-300 delay-100 flex items-center justify-center h-12">
            Tin tức
          </li>
          <li className="mx-6 pr-10 cursor-pointer hover:text-[#3CA9F9] transition duration-300 delay-100 flex items-center justify-center h-12">
            Hướng dẫn
          </li>
          <li className="mx-6 pr-10 cursor-pointer hover:text-[#3CA9F9] transition duration-300 delay-100 flex items-center justify-center h-12">
            Liên hệ
          </li>
        </ul>
      </div>
      <div className="pb-4">
        <button
          className="px-4 py-2 font-bold font-montserrat text-[1.2rem] rounded-lg bg-[#3CA9F9] text-white hover:bg-blue-600
        transition duration-300"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
}

export default Header;
