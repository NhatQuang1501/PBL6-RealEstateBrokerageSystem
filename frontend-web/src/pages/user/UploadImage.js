import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../AppProvider";

function UploadImage() {
  const [images, setImages] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [canBack, setCanBack] = useState(false);
  const { postId } = useParams();
  const { sessionToken } = useAppContext();
  let navigate = useNavigate();

  // Handle image selection
  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  // Handle image upload
  const handleUpload = async () => {
    if (images.length === 0) {
      alert("Vui lòng chọn ít nhất một ảnh trước khi tải lên.");
      return;
    }

    try {
      for (const image of images) {
        const formData = new FormData();
        formData.append("image", image);

        await axios.post(
          `http://127.0.0.1:8000/api/posts/${postId}/images/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      setUploadStatus(
        "Tất cả ảnh đã được tải lên thành công! Bạn có thể tải thêm ảnh khác hoặc trở lại xem chi tiết bài đăng."
      );
      setCanBack(true);
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
      setUploadStatus("Tải lên thất bại!");
    }
  };

  // Handle back to post detail
  const handleBack = () => {
    navigate(`/user/detail-post/${postId}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-200 p-6 font-montserrat">
      <div className="bg-white shadow-lg rounded-lg p-8 w-[60rem] h-[25rem] mb-[10rem]">
        <h2 className="text-2xl font-bold text-center text-[#3CA9F9] mb-4">
          Tải Ảnh Lên
        </h2>

        {/* File Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Chọn ảnh:
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="w-full bg-[#3CA9F9] text-white font-semibold rounded-lg px-4 py-2 mt-4 transition duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1 focus:ring-2 focus:ring-blue-500"
        >
          Tải Lên
        </button>
        {canBack && (
          <button
            onClick={handleBack}
            className="w-full bg-[#3CA9F9] text-white font-semibold rounded-lg px-4 py-2 mt-4 transition duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1 focus:ring-2 focus:ring-blue-500"
          >
            Trở lại xem chi tiết bài đăng
          </button>
        )}

        {/* Status Message */}
        {uploadStatus && (
          <p
            className={`mt-4 text-center font-semibold ${
              uploadStatus.includes("thành công")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {uploadStatus}
          </p>
        )}
      </div>
    </div>
  );
}

export default UploadImage;
