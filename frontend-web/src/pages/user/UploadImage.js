import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../AppProvider";

function UploadImage() {
  const [image, setImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const { postId } = useParams();
  const { sessionToken } = useAppContext();

  // Hàm xử lý khi người dùng chọn ảnh
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Hàm tải ảnh lên
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
      setUploadStatus("Tải lên thành công!");
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
      setUploadStatus("Tải lên thất bại!");
    }
  };

  return (
    <div>
      <h2>Tải Ảnh Lên</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload}>Tải Lên</button>
      <p>{uploadStatus}</p>
    </div>
  );
}

export default UploadImage;
