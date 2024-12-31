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
    fullname: "",
    city: "",
    birthdate: "",
    phone_number: "",
    gender: "Nam",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user data from the API
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/auth/users/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      const { fullname, city, birthdate, phone_number, gender } = response.data;
      setProfileData({ fullname, city, birthdate, phone_number, gender });
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        fullname: profileData.fullname,
        city: profileData.city,
        birthdate: profileData.birthdate,
        phone_number: profileData.phone_number,
        gender: profileData.gender,
      };

      await axios.put(
        `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/auth/users/${id}/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Cập nhật thông tin thành công!");
      navigate("/user/personal-page");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Có lỗi xảy ra khi cập nhật dữ liệu.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center font-montserrat">
      <div className="bg-white shadow-xl rounded-lg p-5 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-5">
          Cập nhật hồ sơ
        </h1>
        <form onSubmit={handleSubmit}>
          {/** Fullname Field */}
          <div className="mb-5">
            <label
              htmlFor="fullname"
              className="flex items-center text-gray-700 font-semibold mb-2"
            >
              <FaUser className="mr-2 text-blue-500" /> Họ tên
            </label>
            <input
              type="text"
              name="fullname"
              value={profileData.fullname}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập họ tên"
              required
            />
          </div>

          {/** City Field */}
          <div className="mb-5">
            <label
              htmlFor="city"
              className="flex items-center text-gray-700 font-semibold mb-2"
            >
              <FaMapMarkerAlt className="mr-2 text-blue-500" /> Thành phố
            </label>
            <input
              type="text"
              name="city"
              value={profileData.city}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập thành phố"
              required
            />
          </div>

          {/** Birthdate Field */}
          <div className="mb-5">
            <label
              htmlFor="birthdate"
              className="flex items-center text-gray-700 font-semibold mb-2"
            >
              <FaBirthdayCake className="mr-2 text-blue-500" /> Ngày sinh
            </label>
            <input
              type="date"
              name="birthdate"
              value={profileData.birthdate}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/** Phone Number Field */}
          <div className="mb-5">
            <label
              htmlFor="phone_number"
              className="flex items-center text-gray-700 font-semibold mb-2"
            >
              <FaPhone className="mr-2 text-blue-500" /> Số điện thoại
            </label>
            <input
              type="tel"
              name="phone_number"
              value={profileData.phone_number}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập số điện thoại"
              required
            />
          </div>

          {/** Gender Field */}
          <div className="mb-5">
            <label
              htmlFor="gender"
              className="flex items-center text-gray-700 font-semibold mb-2"
            >
              <FaTransgenderAlt className="mr-2 text-blue-500" /> Giới tính
            </label>
            <select
              name="gender"
              value={profileData.gender}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-300"
          >
            Cập nhật
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
