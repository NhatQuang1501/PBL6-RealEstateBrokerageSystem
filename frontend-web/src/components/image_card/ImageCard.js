import React, { useState, useEffect } from "react";
import axios from "axios";

const ImageCard = ({ postId, type }) => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/posts/${postId}/images/`
        );

        if (Array.isArray(response.data)) {
          setImages(response.data);
        } else {
          console.error("Dữ liệu không phải là một mảng:", response.data);
          setImages([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu ảnh:", error);
      }
    };

    fetchImages();
  }, [postId]);

  useEffect(() => {
    if (type === "detail") {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [images.length, type]);

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      {type === "detail" && images.length > 1 ? (
        /* Mã cho chế độ chi tiết */
        <div
          className="relative border-[1px] border-double border-[#3CA9F9] rounded-lg p-4 my-4 max-h-full font-extrabold shadow-md overflow-hidden"
          style={{
            backgroundImage: `url(http://127.0.0.1:8000/${images[currentImageIndex].image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Lớp phủ mờ */}
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h4 className="text-[#3CA9F9] text-lg mb-2">Hình ảnh mô tả</h4>
            <div className="flex justify-center items-center">
              {images.map((image, index) => (
                <div
                  key={image.image_id}
                  className={`${
                    index === currentImageIndex ? "block" : "hidden"
                  }`}
                >
                  <img
                    src={`http://127.0.0.1:8000/${image.image}`}
                    alt={`Ảnh của bài đăng: ${image.post_id}`}
                    className="rounded-lg w-[50rem] h-[30rem] object-contain shadow-2xl bg-black"
                  />
                </div>
              ))}
              <button
                className="absolute left-0 bg-[#3CA9F9] text-white px-3 py-2 rounded-full focus:outline-none"
                onClick={handlePrevClick}
              >
                &#9664;
              </button>
              <button
                className="absolute right-0 bg-[#3CA9F9] text-white px-3 py-2 rounded-full focus:outline-none"
                onClick={handleNextClick}
              >
                &#9654;
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Mã cho chế độ thông thường */
        <div
          className="relative rounded-lg p-4 my-4 max-h-[35rem] font-extrabold shadow-md overflow-hidden"
          style={{
            backgroundImage:
              images.length > 0
                ? `url(http://127.0.0.1:8000/${images[currentImageIndex].image})`
                : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Lớp phủ mờ */}
          {images.length > 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          )}
          <div className="relative z-10">
            <h4 className="text-white text-lg mb-2">
              Hình ảnh mô tả ({images.length})
            </h4>
            <div className="flex justify-center">
              {images.length > 0 ? (
                <div className="flex flex-col items-center">
                  <div
                    key={images[currentImageIndex].image_id}
                    className="flex justify-center mb-4"
                  >
                    <img
                      src={`http://127.0.0.1:8000/${images[currentImageIndex].image}`}
                      alt={`Ảnh của bài đăng: ${images[currentImageIndex].post_id}`}
                      className="rounded-lg w-full h-[20rem] object-contain shadow-2xl bg-black"
                    />
                  </div>
                  {images.length > 1 && (
                    <div className="flex justify-center space-x-2">
                      {images.slice(0, 5).map((image, index) => (
                        <div
                          key={image.image_id}
                          className="flex justify-center cursor-pointer"
                          onClick={() => handleThumbnailClick(index)}
                        >
                          <img
                            src={`http://127.0.0.1:8000/${image.image}`}
                            alt={`Ảnh của bài đăng: ${image.post_id}`}
                            className={`rounded-lg w-[5rem] h-[3rem] object-contain shadow-2xl bg-black ${
                              index === currentImageIndex
                                ? "border-2 border-blue-500"
                                : ""
                            }`}
                          />
                        </div>
                      ))}
                      {images.length > 5 && (
                        <div className="flex items-center justify-center w-[7rem] h-[5rem] bg-gray-300 rounded-lg">
                          <span className="text-gray-700 font-bold">
                            +{images.length - 5}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <h2>Không có ảnh nào ...</h2>
                  <img
                    src="https://th.bing.com/th/id/OIP.lrbE4OifoZsRx2TmPb0wvwAAAA?rs=1&pid=ImgDetMain"
                    alt="Không có ảnh nào ..."
                    className="rounded-lg w-[30rem] h-[15rem] object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCard;
