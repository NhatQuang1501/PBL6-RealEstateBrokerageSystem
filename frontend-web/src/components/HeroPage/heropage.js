import React, { useState, useEffect } from 'react';
import img1 from '../../assets/image/hero-bg2.jpg';
import img2 from '../../assets/image/hero-bg3.jpg';
import img3 from '../../assets/image/hero-bg4.jpg';
import img4 from '../../assets/image/hero-bg5.jpg';

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    { url: img1, alt: 'Image 1' },
    { url: img2, alt: 'Image 2' },
    { url: img3, alt: 'Image 3' },
    { url: img4, alt: 'Image 4' },
  ];
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <section className="hero py-20">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-lg">
          {/* Slideshow */}
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute w-full h-[500px] transition-opacity duration-1000 ${currentIndex === index ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
            </div>
          ))}

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white z-10 bg-black bg-opacity-30">
            <h1 className="text-4xl font-bold">
              <span>Chào mừng đến với</span>
            </h1>
            <p className="text-2xl font-semibold mt-4">Hệ thống môi giới nhà đất, bất động sản</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-lg mt-10 p-6">
          <div className="flex space-x-4 mb-6">
            <button className="tab-btn text-green-500 font-semibold px-4 py-2 rounded bg-green-100">
              Bán
            </button>
            <button className="tab-btn text-gray-500 font-semibold px-4 py-2 rounded">
              Cho thuê
            </button>
            <button className="tab-btn text-gray-500 font-semibold px-4 py-2 rounded">
              Tin tức
            </button>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Tìm kiếm:
                </label>
                <input
                  type="search"
                  id="search"
                  name="search"
                  placeholder="Tìm kiếm ..."
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Loại dịch vụ:
                </label>
                <select
                  id="category"
                  name="category"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="house">Nhà</option>
                  <option value="apartment">Chung cư</option>
                  <option value="offices">Văn phòng</option>
                  <option value="townhome">Nhà phố</option>
                </select>
              </div>
              <div>
                <label htmlFor="min-price" className="block text-sm font-medium text-gray-700">
                  Giá nhỏ nhất:
                </label>
                <select
                  id="min-price"
                  name="min-price"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                  <option value="2000">2000</option>
                  <option value="3000">3000</option>
                </select>
              </div>
              <div>
                <label htmlFor="max-price" className="block text-sm font-medium text-gray-700">
                  Giá cao nhất:
                </label>
                <select
                  id="max-price"
                  name="max-price"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                  <option value="2000">2000</option>
                  <option value="3000">3000</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600">
              Tìm kiếm
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
