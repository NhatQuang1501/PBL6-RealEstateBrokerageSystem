import React, { useState, useEffect } from "react";
import axios from "axios";

const ImageCard = ({ postId }) => {
  const [images, setImages] = useState([]); // Khởi tạo `images` là một mảng trống

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

  

  return (
    <div className="border-[1px] border-double border-[#3CA9F9] rounded-lg p-4 my-4 min-h-full font-extrabold shadow-md">
      <h4 className="text-[#3CA9F9] text-lg mb-2">Hình ảnh mô tả</h4>
      <div className="flex justify-center">
        {/* <img
          src={imageUrl}
          alt=""
          className="w-full h-auto rounded-lg shadow-md"
        /> */}
        {images.map((image) => (
          <div key={image.image_id} style={{ margin: "10px" }}>
            <img
              // src={`file:///C:/PBL6-RealEstateBrokerageSystem/backend/${image.image}`}
              src={`C:/PBL6-RealEstateBrokerageSystem/backend/${image.image}`}
              alt={`Related to post ${postId}`}
              style={{ width: "200px", height: "auto" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCard;
