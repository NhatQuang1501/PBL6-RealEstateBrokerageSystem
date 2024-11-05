import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../AppProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function UploadImage() {
  const [image, setImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [canBack, setCanBack] = useState(false);
  const { postId } = useParams();
  const { sessionToken } = useAppContext();
  let navigate = useNavigate();

  // Handle image selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!image) {
      alert("Vui lòng chọn ảnh trước khi tải lên.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/posts/${postId}/images/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadStatus(
        "Tải lên thành công! Bạn có thể tải thêm ảnh khác hoặc trở lại xem chi tiết bài đăng."
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
        <button
          className="bg-[#3CA9F9] text-white px-5 py-3 rounded-full mt-5 self-start flex items-center"
          onClick={() => window.history.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Quay lại
        </button>
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
              uploadStatus === "Tải lên thành công!"
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
