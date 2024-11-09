import React, { useState, useEffect } from "react";
import img1 from "../../assets/image/hero-bg4.jpg";
import img2 from "../../assets/image/hero-bg13.jpg";
import img3 from "../../assets/image/hero-bg8.jpg";

import { FaSearch, FaTimes, FaLightbulb } from "react-icons/fa";

const HeroSection = ({ setSearchValue }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [popupValue, setPopupValue] = useState("");
  const images = [
    { url: img1, alt: "Image 1" },
    { url: img2, alt: "Image 2" },
    { url: img3, alt: "Image 3" },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  const handleInputClick = () => {
    setIsPopupOpen(true);
  };

  const handlePopupChange = (event) => {
    setPopupValue(event.target.value); // Cập nhật giá trị input lớn
    setInputValue(event.target.value); // Đồng bộ giá trị xuống input nhỏ
  };

  const handleOutsideClick = (event) => {
    if (event.target.classList.contains("popup-overlay")) {
      setIsPopupOpen(false);
    }
    handleSearchSubmit();
  };

  const handleSearchSubmit = () => {
    setSearchValue(inputValue);
    alert(`Đang tìm kiếm theo: ${inputValue}`);
    window.scrollBy({
      top: 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="h-[78vh] overflow-hidden font-montserrat">
      <div className="container mx-auto w-full h-full">
        <div className="relative rounded-lg w-[88%] h-full m-auto overflow-hidden">
          <div
            className="flex transition-transform duration-1000 ease-in-out "
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full h-[400px] flex-shrink-0">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            ))}
          </div>

          <div className="main-content h-[400px] flex justify-center flex-col absolute top-0 left-0 right-0 z-10">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#29519f] via-[#b3cdd0] to-[#3CA9F9] drop-shadow-2xl">
              <span>Chào mừng đến với</span>
            </h1>
            <p className="text-2xl font-semibold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-[#fafffe] via-[#e0f7fa] to-[#b2ebf2] drop-shadow-2xl">
              Hệ thống môi giới nhà đất, bất động sản
            </p>
          </div>
        </div>

        <div className="w-full absolute inset-x-0 bottom-[7rem]">
          <div className="rounded-lg mt-10 p-6 w-[70%] m-auto">
            <div className="flex justify-center w-[28%] bg-white px-3 py-3 rounded-t-2xl gap-3 z-10 border-l-2 border-[#3CA9F9] border-double">
              <button className="tab-btn bg-[#3CA9F9] text-white font-semibold px-4 py-2 rounded-xl z-10">
                Nhà
              </button>
              <button className="tab-btn text-black font-semibold px-4 py-2 rounded-xl hover:bg-[#3CA9F9] hover:text-white z-10">
                Đất
              </button>
              <button className="tab-btn text-black font-semibold px-4 py-2 rounded-xl hover:bg-[#3CA9F9] hover:text-white z-10">
                Tin tức
              </button>
            </div>

            <div className="bg-white shadow-lg px-10 py-5 rounded-e-2xl rounded-es-2xl border-l-2 border-b-2 border-r-2 border-[#3CA9F9] border-double">
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <label
                    htmlFor="search"
                    className="block text-base font-bold text-black"
                  >
                    Tìm kiếm:
                  </label>
                  <input
                    type="search"
                    id="search"
                    name="search"
                    placeholder="Tìm kiếm ..."
                    value={inputValue}
                    onClick={handleInputClick}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-[#3CA9F9]"
                    readOnly
                  />

                  {isPopupOpen && (
                    <div
                      className="popup-overlay fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-20"
                      onClick={handleOutsideClick}
                    >
                      <div
                        className="popup-content relative bg-white p-6 rounded-lg shadow-lg w-[50%] transform transition-transform duration-300 ease-out scale-105"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                          onClick={() => setIsPopupOpen(false)}
                        >
                          <FaTimes size={20} />
                        </button>

                        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-center">
                          <FaSearch className="mr-2 text-[#3CA9F9]" /> Tìm kiếm
                          nội dung
                        </h2>

                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaSearch className="text-gray-400" />
                          </span>
                          <input
                            type="text"
                            value={popupValue}
                            onChange={handlePopupChange}
                            placeholder="Nhập nội dung tìm kiếm..."
                            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3CA9F9] transition-shadow"
                          />
                        </div>

                        <div className="mt-4 text-sm text-[#3CA9F9] italic flex items-center">
                          <FaLightbulb className="mr-2" />
                          <p>
                            Bạn có thể tìm kiếm các bài đăng có liên quan đến
                            nội dung tìm kiếm ...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-base font-bold text-gray-700"
                  >
                    Tình trạng:
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:[#3CA9F9] focus:border-[#3CA9F9]"
                  >
                    <option value="">Đang bán</option>
                    <option value="">Đang thương lượng</option>
                    <option value="">Đã cọc</option>
                    <option value="">Đã bán</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="min-price"
                    className="block text-base font-bold text-gray-700"
                  >
                    Giá (VNĐ):
                  </label>
                  <select
                    id="min-price"
                    name="min-price"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:[#3CA9F9] focus:border-[#3CA9F9]"
                  >
                    <option value="">Dưới 500 triệu</option>
                    <option value="">Từ 500 triệu đến 1 tỷ</option>
                    <option value="">Từ 1 tỷ đến 3 tỷ</option>
                    <option value="">Từ 3 tỷ đến 5 tỷ</option>
                    <option value="">Từ 5 tỷ đến 7 tỷ</option>
                    <option value="">Từ 7 tỷ đến 9 tỷ</option>
                    <option value="">Từ 9 tỷ đến 10 tỷ</option>
                    <option value="">Trên 10 tỷ</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="max-price"
                    className="block text-base font-bold text-gray-700"
                  >
                    Diện tích:
                  </label>
                  <select
                    id="max-price"
                    name="max-price"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:[#3CA9F9] focus:border-[#3CA9F9]"
                  >
                    <option value="">Dưới 50m2</option>
                    <option value="">Từ 50m2 đến 100m2</option>
                    <option value="">Từ 100m2 đến 200m2</option>
                    <option value="">Từ 200m2 đến 300m2</option>
                    <option value="">Từ 300m2 đến 500m2</option>
                    <option value="">Từ 500m2 đến 700m2</option>
                    <option value="">Từ 700m2 đến 1000m2</option>
                    <option value="">Trên 1000m2</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSearchSubmit}
                className="w-1/4 py-2 bg-[#3CA9F9] text-white font-semibold rounded-md mt-3"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
