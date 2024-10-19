/* eslint-disable jsx-a11y/anchor-is-valid */
import Logo from "../../assets/image/Logo.png";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

function Footer() {
  return (
    <div className="bg-[#92cbe2]">
      <div className="container mx-auto py-10 main-content">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 font-montserrat">
          <div className="space-y-4">
            <img src={Logo} alt="Logo" className="w-16" />
            <p className="text-gray-800">
              Hệ thống môi giới Nhà-Đất của chúng tôi sử dụng mô hình AI được
              huấn luyện để đưa ra giá cả phù hợp và khớp với giá thị trường
              nhất có thể.
            </p>

            <div className="flex space-x-4 text-gray-700">
              <FaTwitter className="hover:text-gray-500" />
              <FaFacebookF className="hover:text-gray-500" />
              <FaLinkedinIn className="hover:text-gray-500" />
              <FaInstagram className="hover:text-gray-500" />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Dịch vụ</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <a href="#" className="hover:underline hover:cursor-pointer">
                  Xem thông tin đăng bán
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:cursor-pointer">
                  Đăng bài viết
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:cursor-pointer">
                  Tìm kiếm
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:cursor-pointer">
                  Tin tức
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <a href="#" className="hover:underline">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Về chúng tôi
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Địa chỉ</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                Địa chỉ:{" "}
                <span className="font-semibold">
                  54 Nguyễn Lương Bằng, phường Hòa Khánh Bắc, Quận Liên Chiểu,
                  Đà Nẵng, Việt Nam
                </span>
              </li>
              <li>
                Email:{" "}
                <a href="mailto:email@gmail.com" className="hover:underline">
                  pbl6@gmail.com
                </a>
              </li>
              <li>
                Phone:{" "}
                <a href="tel:+000123456789" className="hover:underline">
                  0123456789
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-300 my-8" />

        <div className="text-center text-gray-600">Made by PBL6 members</div>
      </div>
    </div>
  );
}

export default Footer;
