import React, { useState, useEffect } from "react";
import img1 from "../../assets/image/hero-bg4.jpg";
import img2 from "../../assets/image/hero-bg13.jpg";
import img3 from "../../assets/image/hero-bg8.jpg";

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    { url: img1, alt: "Image 1" },
    { url: img2, alt: "Image 2" },
    { url: img3, alt: "Image 3" },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <section className="h-[78vh] overflow-hidden font-montserrat">
      <div className="container mx-auto w-full h-full">
        <div className="relative w-[88%] h-full m-auto overflow-hidden ">
      
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
                  className="w-full h-full object-cover rounded-4xl"
                />
              </div>
            ))}
          </div>

         
          <div className="main-content h-[400px] flex justify-center flex-col absolute top-0 left-0 right-0 z-10">
            <h1 className="text-4xl font-bold text-white drop-shadow-2xl">
              <span>Chào mừng đến với</span>
            </h1>
            <p className="text-2xl font-semibold mt-4 text-white drop-shadow-2xl">
              Hệ thống môi giới nhà đất, bất động sản
            </p>
          </div>
        </div>


        <div className="w-full absolute inset-x-0 bottom-[7rem]">
          <div className="rounded-lg mt-10 p-6 w-[70%] m-auto">
            <div className="flex justify-center w-[28%] bg-white px-3 py-3 rounded-t-2xl gap-3 z-40">
              <button className="tab-btn bg-[#3CA9F9] text-white font-semibold px-4 py-2 rounded-xl z-40">
                Nhà
              </button>
              <button className="tab-btn text-black font-semibold px-4 py-2 rounded-xl hover:bg-[#3CA9F9] hover:text-white z-40">
                Đất
              </button>
              <button className="tab-btn text-black font-semibold px-4 py-2 rounded-xl hover:bg-[#3CA9F9] hover:text-white z-40">
                Tin tức
              </button>
            </div>

            <form className="bg-white shadow-lg px-10 py-5 rounded-e-2xl rounded-es-2xl">
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <label
                    htmlFor="search"
                    className="block text-base font-medium text-black"
                  >
                    Tìm kiếm:
                  </label>
                  <input
                    type="search"
                    id="search"
                    name="search"
                    placeholder="Tìm kiếm ..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:[#3CA9F9] focus:border-[#3CA9F9]"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-base font-medium text-gray-700"
                  >
                    Tình trạng:
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:[#3CA9F9] focus:border-[#3CA9F9]"
                  >
                    <option value="">Đã bán</option>
                    <option value="">Chưa bán</option>

                  </select>
                </div>
                <div>
                  <label
                    htmlFor="min-price"
                    className="block text-base font-medium text-gray-700"
                  >
                    Giá:
                  </label>
                  <select
                    id="min-price"
                    name="min-price"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:[#3CA9F9] focus:border-[#3CA9F9]"
                  >
                    <option value="">Dưới 500tr</option>
                    <option value="">Từ 500tr đến 1ty</option>
                    <option value="">Từ 1ty đến 3 tỷ</option>
                    <option value="">3 tỷ trở lên</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="max-price"
                    className="block text-base font-medium text-gray-700"
                  >
                    Diện tích:
                  </label>
                  <select
                    id="max-price"
                    name="max-price"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:[#3CA9F9] focus:border-[#3CA9F9]"
                  >
                    <option value="">Dưới 100m2</option>
                    <option value="">Từ 100m2 đến 500m2</option>
                    <option value="">500m2 trở lên</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-1/4 py-2 bg-[#3CA9F9] text-white font-semibold rounded-md mt-3"
              >
                Tìm kiếm
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
