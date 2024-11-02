import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../../AppProvider";
import {
  FaUser,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaPhone,
  FaTransgenderAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {

  const { id, sessionToken } = useAppContext();
  const [profileData, setProfileData] = useState({
    email: "",
    fullname: "",
    city: "",
    birthdate: "",
    phone_number: "",
    gender: "Nam",
    avatar: "Chưa có thông tin",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let navigate = useNavigate();

  // Hàm lấy dữ liệu người dùng từ API
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/auth/users/${id}/`
      );
      setProfileData(response.data);
      console.log("dữ liệu thu được",response.data);
      setLoading(false);
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu.");
      setLoading(false);
    }
  };

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Hàm xử lý gửi form
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.put(`http://127.0.0.1:8000/auth/users/${id}/`, profileData, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
    });
    alert("Cập nhật thông tin thành công!");
    navigate("/user/personal-page");
  } catch (err) {
    setError("Có lỗi xảy ra khi cập nhật dữ liệu.");
  }
};

  // Gọi API khi component được mount
  useEffect(() => {
    fetchUserData();
  }, [id]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

return (
  <div className="container mx-auto p-5 font-montserrat">
    <h1 className="text-3xl font-bold mb-5 text-center text-blue-600">
      Cập nhật hồ sơ
    </h1>
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg p-6 transition-transform duration-300 hover:shadow-xl"
    >
      <div className="mb-4">
        <label
          htmlFor="fullname"
          className="flex items-center text-gray-700 font-bold mb-2"
        >
          <FaUser className="mr-2 text-blue-500" />
          Họ tên
        </label>
        <input
          type="text"
          name="fullname"
          value={profileData.fullname}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="city"
          className="flex items-center text-gray-700 font-bold mb-2"
        >
          <FaMapMarkerAlt className="mr-2 text-blue-500" />
          Thành phố
        </label>
        <input
          type="text"
          name="city"
          value={profileData.city}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="birthdate"
          className="flex items-center text-gray-700 font-bold mb-2"
        >
          <FaBirthdayCake className="mr-2 text-blue-500" />
          Ngày sinh
        </label>
        <input
          type="date"
          name="birthdate"
          value={profileData.birthdate}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="phone_number"
          className="flex items-center text-gray-700 font-bold mb-2"
        >
          <FaPhone className="mr-2 text-blue-500" />
          Số điện thoại
        </label>
        <input
          type="tel"
          name="phone_number"
          value={profileData.phone_number}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="gender"
          className="flex items-center text-gray-700 font-bold mb-2"
        >
          <FaTransgenderAlt className="mr-2 text-blue-500" />
          Giới tính
        </label>
        <select
          name="gender"
          value={profileData.gender}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded transition-transform duration-300 hover:bg-blue-600"
      >
        Cập nhật
      </button>
    </form>
  </div>
);
};

export default UpdateProfile;
