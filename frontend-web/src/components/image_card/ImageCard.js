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

        // Kiểm tra nếu dữ liệu trả về là một mảng trước khi gán vào `images`
        if (Array.isArray(response.data)) {
          setImages(response.data);
        } else {
          console.error("Dữ liệu không phải là một mảng:", response.data);
          setImages([]); // Đảm bảo `images` vẫn là mảng trống nếu dữ liệu sai kiểu
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu ảnh:", error);
      }
    };

    fetchImages();
  }, [postId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <>
      {type === "detail" && images.length > 1 ? (
        <div className="border-[1px] border-double border-[#3CA9F9] rounded-lg p-4 my-4 max-h-full font-extrabold shadow-md bg-gray-200 bg-opacity-50">
          <h4 className="text-[#3CA9F9] text-lg mb-2">Hình ảnh mô tả</h4>
          <div className="relative flex justify-center items-center">
            {images.map((image, index) => (
              <div
                key={image.image_id}
                style={{
                  margin: "10px",
                  opacity: index === currentImageIndex ? 1 : 0,
                  transition: "opacity 1s ease-in-out",
                  position:
                    index === currentImageIndex ? "relative" : "absolute",
                }}
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
      ) : (
        <div className="border-[1px] border-double border-[#3CA9F9] rounded-lg p-4 my-4 max-h-[30rem] font-extrabold shadow-md bg-gray-200 bg-opacity-50">
          <h4 className="text-[#3CA9F9] text-lg mb-2">
            Hình ảnh mô tả ({images.length})
          </h4>
          <div className="flex justify-start ">
            {images.length > 0 && (
              <div className="flex flex-col items-center">
                <div
                  key={images[0].image_id}
                  className="flex justify-center mb-4"
                >
                  <img
                    src={`http://127.0.0.1:8000/${images[0].image}`}
                    alt={`Ảnh của bài đăng: ${images[0].post_id}`}
                    className="rounded-lg w-[30rem] h-[15rem] object-contain  shadow-2xl bg-black"
                  />
                </div>
                {images.length > 1 && (
                  <div className="flex justify-center space-x-2">
                    {images.slice(1, 5).map((image, index) => (
                      <div key={image.image_id} className="flex justify-center">
                        <img
                          src={`http://127.0.0.1:8000/${image.image}`}
                          alt={`Ảnh của bài đăng: ${image.post_id}`}
                          className="rounded-lg w-[5rem] h-[3rem] object-contain  shadow-2xl bg-black"
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
            )}
            {images.length === 0 && (
              <div className="flex flex-col items-center">
                <h2>Không có ảnh nào ...</h2>
                <img
                  src={`https://th.bing.com/th/id/OIP.lrbE4OifoZsRx2TmPb0wvwAAAA?rs=1&pid=ImgDetMain`}
                  alt={`Không có ảnh nào ...`}
                  className="rounded-lg w-[30rem] h-[15rem] object-contain"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCard;
