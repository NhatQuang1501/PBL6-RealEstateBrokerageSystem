import React, { useState } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaRulerCombined,
  FaRoad,
  FaMapMarkerAlt,
  FaHome,
  FaBed,
  FaToilet,
  FaBuilding,
  FaCouch,
} from "react-icons/fa";

const PredictHousePrice = () => {
  const [formData, setFormData] = useState({
    area: "",
    floors: "",
    rooms: "",
    toilets: "",
    house_type: "",
    furnishing_sell: "",
    living_size: "",
    width: "",
    length: "",
    orientation: "",
    street: "",
    ward: "",
  });
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "ward" ? value.replace(/Hòa/g, "Hoà") : value,
    });
  };

  const validateForm = () => {
    const {
      area,
      floors,
      rooms,
      toilets,
      house_type,
      furnishing_sell,
      living_size,
      width,
      length,
      orientation,
      street,
      ward,
    } = formData;
    if (
      !area ||
      !floors ||
      !rooms ||
      !toilets ||
      !house_type.trim() ||
      !furnishing_sell.trim() ||
      !living_size ||
      !width ||
      !length ||
      !orientation.trim() ||
      !street.trim() ||
      !ward.trim()
    ) {
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
        "http://127.0.0.1:8000/api/predict-house-price/",
        formData
      );
      setPredictedPrice(response.data.predicted_price);
    } catch (error) {
      console.error("Error predicting price:", error);
      setError("Đã xảy ra lỗi khi dự đoán. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Step form
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            {/* Diện tích */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="area"
              >
                Diện tích đất (m²):
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

            {/* Số tầng */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="floors"
              >
                Số tầng:
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="px-3">
                  <FaBuilding className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="floors"
                  name="floors"
                  value={formData.floors}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-none outline-none"
                  placeholder="Nhập số tầng"
                  required
                />
              </div>
            </div>

            {/* Số phòng ngủ */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="rooms"
              >
                Số phòng ngủ:
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="px-3">
                  <FaBed className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="rooms"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-none outline-none"
                  placeholder="Nhập số phòng ngủ"
                  required
                />
              </div>
            </div>

            {/* Số toilet */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="toilets"
              >
                Số toilet:
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="px-3">
                  <FaToilet className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="toilets"
                  name="toilets"
                  value={formData.toilets}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-none outline-none"
                  placeholder="Nhập số toilet"
                  required
                />
              </div>
            </div>

            {/* Nút tiếp theo */}
            <div className="text-center">
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Tiếp theo
              </button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            {/* Diện tích sử dụng */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="living_size"
              >
                Diện tích sử dụng (m²):
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="px-3">
                  <FaCouch className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="living_size"
                  name="living_size"
                  value={formData.living_size}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-none outline-none"
                  placeholder="Nhập diện tích sử dụng"
                  required
                />
              </div>
            </div>

            {/* Chiều rộng */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="width"
              >
                Chiều rộng (m):
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="px-3">
                  <FaRulerCombined className="text-gray-400" />
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

            {/* Chiều dài */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="length"
              >
                Chiều dài (m):
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="px-3">
                  <FaRulerCombined className="text-gray-400" />
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

            {/* Hướng nhà */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="orientation"
              >
                Hướng nhà:
              </label>
              <select
                id="orientation"
                name="orientation"
                value={formData.orientation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-lg outline-none"
                required
              >
                <option value="">Chọn hướng nhà</option>
                <option value="Đông">Đông</option>
                <option value="Tây">Tây</option>
                <option value="Nam">Nam</option>
                <option value="Bắc">Bắc</option>
                <option value="Đông Bắc">Đông Bắc</option>
                <option value="Đông Nam">Đông Nam</option>
                <option value="Tây Bắc">Tây Bắc</option>
                <option value="Tây Nam">Tây Nam</option>
              </select>
            </div>

            {/* Nút quay lại và tiếp theo */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Tiếp theo
              </button>
            </div>
          </>
        );

      case 3:
        return (
          <>
            {/* Đường */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="street"
              >
                Tên đường:
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="px-3">
                  <FaRoad className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-none outline-none"
                  placeholder="Nhập tên đường"
                  required
                />
              </div>
            </div>

            {/* Phường */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="ward"
              >
                Tên phường:
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
                  placeholder="Nhập tên phường"
                  required
                />
              </div>
            </div>

            {/* Loại nhà */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="house_type"
              >
                Loại nhà:
              </label>
              <select
                id="house_type"
                name="house_type"
                value={formData.house_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-lg outline-none"
                required
              >
                <option value="">Chọn loại nhà</option>
                <option value="Nhà mặt phố, mặt tiền">
                  Nhà mặt phố, mặt tiền
                </option>
                <option value="Nhà phố liền kề">Nhà phố liền kề</option>
                <option value="Nhà ngõ, hẻm">Nhà ngõ, hẻm</option>
                <option value="Biệt thự">Biệt thự</option>
              </select>
            </div>

            {/* Giao nhà */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="furnishing_sell"
              >
                Giao nhà:
              </label>
              <select
                id="furnishing_sell"
                name="furnishing_sell"
                value={formData.furnishing_sell}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-lg outline-none"
                required
              >
                <option value="">Chọn tình trạng</option>
                <option value="Hoàn thiện cơ bản">Hoàn thiện cơ bản</option>
                <option value="Bàn giao thô">Bàn giao thô</option>
                <option value="Nội thất đầy đủ">Nội thất đầy đủ</option>
                <option value="Nội thất cao cấp">Nội thất cao cấp</option>
              </select>
            </div>

            {/* Nút quay lại và nhận dự đoán */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className={`px-6 py-2 text-white font-medium rounded-lg ${
                  loading ? "bg-gray-400" : "bg-blue-600"
                } hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                disabled={loading}
              >
                {loading ? "Đang dự đoán..." : "Dự đoán giá nhà"}
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg shadow-blue-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600 flex items-center justify-center">
        <FaHome className="mr-2" />
        Dự Đoán Giá Nhà
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStep()}

        {/* Hiển thị lỗi hoặc giá dự đoán */}
        {error && (
          <p className="text-red-500 text-center font-medium mt-4">
            <FaTimesCircle className="inline mr-2" />
            {error}
          </p>
        )}
        {predictedPrice && (
          <div className="mt-6 flex items-center text-green-600 bg-green-100 p-4 rounded-lg shadow">
            <FaCheckCircle className="mr-2 text-xl" />
            <span className="text-lg">
              Giá dự đoán:{" "}
              <strong>{predictedPrice.toLocaleString()} VND</strong>
            </span>
          </div>
        )}
      </form>
    </div>
  );
};

export default PredictHousePrice;
