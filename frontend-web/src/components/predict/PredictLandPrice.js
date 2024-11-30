import React, { useState } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaRulerCombined,
  FaRoad,
  FaArrowAltCircleRight,
  FaMapMarkerAlt,
  FaCommentDollar,
} from "react-icons/fa";

const PredictLandPrice = () => {
  const [formData, setFormData] = useState({
    area: "",
    width: "",
    length: "",
    has_frontage: false,
    has_car_lane: false,
    has_rear_expansion: false,
    orientation: "",
    ward: "",
  });
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedValue = value;

    if (name === "ward") {
      // Đổi "Hòa" thành "Hoà" trong trường ward
      updatedValue = value.replace(/Hòa/g, "Hoà");
    }
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : updatedValue,
    });
  };

  const validateForm = () => {
    const { area, width, length, orientation, ward } = formData;
    if (!area || !width || !length || !orientation.trim() || !ward.trim()) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/predict-price/",
        {
          ...formData,
          has_frontage: formData.has_frontage ? 1 : 0,
          has_car_lane: formData.has_car_lane ? 1 : 0,
          has_rear_expansion: formData.has_rear_expansion ? 1 : 0,
        }
      );
      setPredictedPrice(response.data.predicted_price);
    } catch (error) {
      console.error("Error predicting price:", error);
      setError("Đã xảy ra lỗi khi dự đoán. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg shadow-blue-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600 flex items-center justify-center">
        <FaCommentDollar className="mr-2" />
        Dự Đoán Giá Bất Động Sản
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Diện tích */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="area"
          >
            Diện tích (m²):
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <div className="px-3">
              <FaRulerCombined className="text-gray-400" />
            </div>
            <input
              type="number"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-none outline-none"
              placeholder="Nhập diện tích đất"
              required
            />
          </div>
        </div>
        {/* Chiều rộng và Chiều dài */}
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="width"
            >
              Chiều rộng (m):
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <div className="px-3">
                <FaRoad className="text-gray-400" />
              </div>
              <input
                type="number"
                id="width"
                name="width"
                value={formData.width}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-none outline-none"
                placeholder="Nhập chiều rộng"
                required
              />
            </div>
          </div>
          <div className="w-1/2">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="length"
            >
              Chiều dài (m):
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <div className="px-3">
                <FaRoad className="text-gray-400" />
              </div>
              <input
                type="number"
                id="length"
                name="length"
                value={formData.length}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-none outline-none"
                placeholder="Nhập chiều dài"
                required
              />
            </div>
          </div>
        </div>
        {/* Các Checkbox */}
        <div className="space-y-3">
          <label className="flex items-center text-gray-700">
            <input
              type="checkbox"
              name="has_frontage"
              checked={formData.has_frontage}
              onChange={handleChange}
              className="mr-2 form-checkbox h-5 w-5 text-blue-600"
            />
            <FaArrowAltCircleRight className="mr-1 text-gray-500" />
            Có mặt tiền
          </label>
          <label className="flex items-center text-gray-700">
            <input
              type="checkbox"
              name="has_car_lane"
              checked={formData.has_car_lane}
              onChange={handleChange}
              className="mr-2 form-checkbox h-5 w-5 text-blue-600"
            />
            <FaArrowAltCircleRight className="mr-1 text-gray-500" />
            Có đường ô tô
          </label>
          <label className="flex items-center text-gray-700">
            <input
              type="checkbox"
              name="has_rear_expansion"
              checked={formData.has_rear_expansion}
              onChange={handleChange}
              className="mr-2 form-checkbox h-5 w-5 text-blue-600"
            />
            <FaArrowAltCircleRight className="mr-1 text-gray-500" />
            Có nở hậu
          </label>
        </div>
        {/* Hướng và Phường */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="orientation"
          >
            Hướng:
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <div className="px-3">
              <FaMapMarkerAlt className="text-gray-400" />
            </div>
            <input
              type="text"
              id="orientation"
              name="orientation"
              value={formData.orientation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-none outline-none"
              placeholder="Nhập hướng"
              required
            />
          </div>
        </div>
        {/* "Vĩnh Trung", "Thạc Gián", "Thuận Phước", "Thạch Thang", "Hải Châu I", "Hải Châu II", "Phước Ninh", "Bình Hiên" */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="ward"
          >
            Phường:
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <div className="px-3">
              <FaMapMarkerAlt className="text-gray-400" />
            </div>
            <input
              type="text"
              id="ward"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-none outline-none"
              placeholder="Nhập phường"
              required
            />
          </div>
        </div>
        {/* Nút Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-4 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Đang dự đoán...
            </>
          ) : (
            "Dự Đoán Giá"
          )}
        </button>
      </form>

      {/* Thông báo lỗi */}
      {error && (
        <div className="mt-4 flex items-center text-red-600">
          <FaTimesCircle className="mr-2" />
          {error}
        </div>
      )}

      {/* Giá dự đoán */}
      {predictedPrice && (
        <div className="mt-6 flex items-center text-green-600 bg-green-100 p-4 rounded-lg shadow">
          <FaCheckCircle className="mr-2 text-xl" />
          <span className="text-lg">
            Giá dự đoán: <strong>{predictedPrice.toLocaleString()} VND</strong>
          </span>
        </div>
      )}
    </div>
  );
};

export default PredictLandPrice;
