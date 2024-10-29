import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../../AppProvider";

const UpdateProfile = () => {

  const { id, sessionToken } = useAppContext();
  const [profileData, setProfileData] = useState({
    email: "",
    username: "",
    fullname: "",
    city: "",
    birthdate: "",
    phone_number: "",
    gender: "Nam",
    avatar: "Chưa có thông tin",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm lấy dữ liệu người dùng từ API
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/auth/users/${id}/`
      );
      setProfileData(response.data);
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
      await axios.put(
        `http://127.0.0.1:8000/auth/users/${id}/`,
        profileData
      );
      alert("Cập nhật thông tin thành công!");
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
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Cập nhật hồ sơ</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="mb-4">
          <label
            htmlFor="fullname"
            className="block text-gray-700 font-bold mb-2"
          >
            Họ tên
          </label>
          <input
            type="text"
            name="fullname"
            value={profileData.fullname}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 font-bold mb-2"
          >
            Tên người dùng
          </label>
          <input
            type="text"
            name="username"
            value={profileData.username}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="city" className="block text-gray-700 font-bold mb-2">
            Thành phố
          </label>
          <input
            type="text"
            name="city"
            value={profileData.city}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="birthdate"
            className="block text-gray-700 font-bold mb-2"
          >
            Ngày sinh
          </label>
          <input
            type="date"
            name="birthdate"
            value={profileData.birthdate}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="phone_number"
            className="block text-gray-700 font-bold mb-2"
          >
            Số điện thoại
          </label>
          <input
            type="tel"
            name="phone_number"
            value={profileData.phone_number}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="gender"
            className="block text-gray-700 font-bold mb-2"
          >
            Giới tính
          </label>
          <select
            name="gender"
            value={profileData.gender}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
            required
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="avatar"
            className="block text-gray-700 font-bold mb-2"
          >
            Ảnh đại diện
          </label>
          <input
            type="text"
            name="avatar"
            value={profileData.avatar}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="Chưa có thông tin"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
