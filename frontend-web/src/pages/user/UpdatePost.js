import React, { useState, useEffect } from "react";
import { useAppContext } from "../../AppProvider";
import { useNavigate, useParams } from "react-router-dom";

import ImageCard from "../../components/image_card/ImageCard";
import DetailDescription from "../../components/detail_description/DetailDescription";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import {
  faTag,
  faCheck,
  faDollarSign,
  faRuler,
  faCompass,
  faBed,
  faBath,
  faBuilding,
  faBalanceScale,
  faRoad,
  faMapMarkerAlt,
  faMapSigns,
  faCity,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import MapView from "../../components/map_api/Mapbox";
import MapUpdate from "../../components/map_api/MapUpdate";

const UpdatePost = () => {
  const { sessionToken } = useAppContext();
  const [post, setPost] = useState({});
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [orientation, setOrientation] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [bathroom, setBathroom] = useState("");
  const [floor, setFloor] = useState("");
  const [legalStatus, setLegalStatus] = useState("");
  const [frontage, setFrontage] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [saleStatus, setSaleStatus] = useState("");
  const { postId } = useParams();
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [estateType, setEstateType] = useState("");
  let navigate = useNavigate();

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  useEffect(() => {
    const fetchPostById = async () => {
      try {
        const url = `http://127.0.0.1:8000/api/posts/${postId}/`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch post");

        const data = await response.json();
        setPost(data);
        setTitle(data.title);
        setPrice(data.price);
        setArea(data.area);
        setOrientation(data.orientation);
        setBedroom(data.bedroom);
        setBathroom(data.bathroom);
        setFloor(data.floor);
        setLegalStatus(data.legal_status);
        setFrontage(data.frontage);
        setAddress(data.address);
        setDistrict(data.district);
        setCity(data.city);
        setDescription(data.description);
        setSaleStatus(data.sale_status);
        setLongitude(data.longitude);
        setLatitude(data.latitude);
        setEstateType(data.estate_type);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPostById();
  }, [postId]);

  const handleUpdate = async () => {
    const updatedPost = {
      title,
      price,
      area,
      orientation,
      bedroom,
      bathroom,
      floor,
      legal_status: legalStatus,
      frontage,
      address,
      district,
      city,
      description,
      sale_status: saleStatus,
      longitude,
      latitude,
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/posts/${postId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPost),
        }
      );
      if (response.ok) {
        console.log("Post updated successfully");
        navigate(`/user/detail-post/${postId}`);
      } else {
        console.error("Failed to update the post");
        alert("Cập nhật bài đăng thất bại !");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCoordinatesChange = (lng, lat) => {
    setLongitude(lng);
    setLatitude(lat);
  };

  const handleConfirmedCoordinates = (lng, lat) => {
    setLongitude(lng);
    setLatitude(lat);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#E4FFFC] to-blue-400 font-montserrat p-10">
      <h3 className="text-3xl font-bold text-white flex items-center gap-3 bg-blue-500 px-8 py-4 rounded-full shadow-lg mb-8">
        <FontAwesomeIcon icon={faListAlt} className="text-white" />
        Chỉnh sửa bài đăng
      </h3>

      <div className="bg-white rounded-lg shadow-2xl p-10 max-w-5xl w-full space-y-8 border-t-4 border-[#3CA9F9]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 rounded-full p-2">
              <FontAwesomeIcon icon={faTag} />
            </div>
            <label className="text-gray-700 font-bold w-1/4">Tiêu đề</label>
            <input
              className="input-style text-lg font-semibold border-gray-300 border-[1px] border-double p-2 rounded-lg bg-blue-50 focus:border-blue-400 focus:bg-white flex-grow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài đăng"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-600 rounded-full p-2">
              <FontAwesomeIcon icon={faCheck} />
            </div>
            <label className="text-gray-700 font-bold w-1/4">
              Tình trạng bán
            </label>
            <select
              className="input-style text-lg border-gray-300 border-[1px] border-double p-2 rounded-lg bg-blue-50 focus:border-blue-400 focus:bg-white flex-grow"
              value={saleStatus}
              onChange={(e) => setSaleStatus(e.target.value)}
            >
              <option value="" disabled>
                Nhập tình trạng bán
              </option>
              <option value="Đang bán">Đang bán</option>
              {/* <option value="Đang thương lượng">Đang thương lượng</option> */}
              <option value="Đã cọc">Đã cọc</option>
              <option value="Đã bán">Đã bán</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 pt-5">
          {[
            {
              label: "Giá (VNĐ)",
              icon: faDollarSign,
              color: "text-yellow-600",
              bg: "bg-yellow-100",
              value: price,
              setter: setPrice,
              type: "number",
            },
            {
              label: "Diện tích",
              icon: faRuler,
              color: "text-purple-600",
              bg: "bg-purple-100",
              value: area,
              setter: setArea,
              type: "number",
            },
            {
              label: "Hướng",
              icon: faCompass,
              color: "text-red-600",
              bg: "bg-red-100",
              value: orientation,
              setter: setOrientation,
              type: "select",
              options: [
                "Đông",
                "Tây",
                "Nam",
                "Bắc",
                "Đông Bắc",
                "Tây Bắc",
                "Đông Nam",
                "Tây Nam",
              ],
            },
            {
              label: "Số phòng ngủ",
              icon: faBed,
              color: "text-blue-600",
              bg: "bg-blue-100",
              value: bedroom,
              setter: setBedroom,
              type: "number",
            },
            {
              label: "Số phòng tắm",
              icon: faBath,
              color: "text-teal-600",
              bg: "bg-teal-100",
              value: bathroom,
              setter: setBathroom,
              type: "number",
            },
            {
              label: "Số tầng",
              icon: faBuilding,
              color: "text-indigo-600",
              bg: "bg-indigo-100",
              value: floor,
              setter: setFloor,
              type: "number",
            },
            {
              label: "Tình trạng pháp lý",
              icon: faBalanceScale,
              color: "text-pink-600",
              bg: "bg-pink-100",
              value: legalStatus,
              setter: setLegalStatus,
              type: "select",
              options: ["Sổ đỏ", "Sổ hồng", "Chưa có", "Khác"],
            },
            {
              label: "Mặt tiền",
              icon: faRoad,
              color: "text-gray-600",
              bg: "bg-gray-100",
              value: frontage,
              setter: setFrontage,
              type: "number",
            },
            {
              label: "Địa chỉ",
              icon: faMapMarkerAlt,
              color: "text-orange-600",
              bg: "bg-orange-100",
              value: address,
              setter: setAddress,
              type: "input",
            },
            {
              label: "Quận/Huyện",
              icon: faMapSigns,
              color: "text-green-600",
              bg: "bg-green-100",
              value: district,
              setter: setDistrict,
              type: "select",
              options: [
                "Liên Chiểu",
                "Thanh Khê",
                "Hải Châu",
                "Sơn Trà",
                "Ngũ Hành Sơn",
                "Cẩm Lệ",
                "Hòa Vang",
              ],
            },
            {
              label: "Thành phố",
              icon: faCity,
              color: "text-blue-600",
              bg: "bg-blue-100",
              value: city,
              setter: setCity,
              type: "input",
            },
          ].map((field) => (
            <div key={field.label} className="flex items-center gap-3">
              <div className={`${field.bg} ${field.color} rounded-full p-2`}>
                <FontAwesomeIcon icon={field.icon} />
              </div>
              <label className="text-gray-700 font-bold w-1/4">
                {field.label}
              </label>

              {/* Render `input` nếu là field type "input", ngược lại là `select` */}
              {field.type === "input" && (
                <input
                  placeholder={field.label}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="input-style border-gray-300 border-[1px] border-double p-2 rounded-lg bg-blue-50 focus:border-blue-400 focus:bg-white flex-grow"
                />
              )}
              {field.type === "select" && (
                <select
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="input-style border-gray-300 border-[1px] border-double p-2 rounded-lg bg-blue-50 focus:border-blue-400 focus:bg-white flex-grow"
                >
                  <option value="" disabled>
                    Chọn {field.label}
                  </option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              {field.type === "number" && field.label === "Giá (VNĐ)" && (
                <input
                  type="number"
                  min="0"
                  placeholder={field.label}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="input-style border-gray-300 border-[1px] border-double p-2 rounded-lg bg-blue-50 focus:border-blue-400 focus:bg-white flex-grow"
                />
              )}
              {field.type === "number" && field.label === "Diện tích" && (
                <input
                  type="number"
                  min="0"
                  placeholder={field.label}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="input-style border-gray-300 border-[1px] border-double p-2 rounded-lg bg-blue-50 focus:border-blue-400 focus:bg-white flex-grow"
                />
              )}
              {field.type === "number" && field.label === "Mặt tiền" && (
                <input
                  type="number"
                  min="0"
                  placeholder={field.label}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="input-style border-gray-300 border-[1px] border-double p-2 rounded-lg bg-blue-50 focus:border-blue-400 focus:bg-white flex-grow"
                />
              )}
              {field.type === "number" &&
                field.label === "Số phòng ngủ" &&
                estateType === "Nhà" && (
                  <input
                    type="number"
                    min="0"
                    placeholder={field.label}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="input-style border-gray-300 border-[1px] border-double p-2 rounded-lg bg-blue-50 focus:border-blue-400 focus:bg-white flex-grow"
                  />
                )}
              {field.type === "number" &&
                field.label === "Số phòng tắm" &&
                estateType === "Nhà" && (
                  <input
                    type="number"
                    min="0"
                    placeholder={field.label}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="input-style border-gray-300 border-[1px] border-double p-2 rounded-lg bg-blue-50 focus:border-blue-400 focus:bg-white flex-grow"
                  />
                )}
              {field.type === "number" &&
                field.label === "Số tầng" &&
                estateType === "Nhà" && (
                  <input
                    type="number"
                    min="0"
                    placeholder={field.label}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="input-style border-gray-300 border-[1px] border-double p-2 rounded-lg bg-blue-50 focus:border-blue-400 focus:bg-white flex-grow"
                  />
                )}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-3 justify-center bg-blue-100 px-5 py-2 rounded-2xl">
            <div className="bg-white text-blue-600 rounded-full p-2">
              <FontAwesomeIcon icon={faInfoCircle} />
            </div>
            <label className="text-blue-600 font-bold text-center">Mô tả</label>
          </div>

          <div className="w-full">
            <ReactQuill
              value={description}
              onChange={setDescription}
              placeholder="Nhập mô tả chi tiết"
              className="h-[50rem] overflow-y-auto mb-[5rem] border-gray-300 border-[1px] border-double p-2 rounded-lg focus:border-blue-400"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 ">
          <div className="flex items-center gap-3 justify-center bg-red-100 px-5 py-2 rounded-2xl mb-[-3rem]">
            <div className="bg-white text-red-700 rounded-full p-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <label className="text-red-700 font-bold text-center">
              Bản đồ
            </label>
          </div>
          <MapUpdate
            longitude={post.longitude}
            latitude={post.latitude}
            onCoordinatesChange={handleCoordinatesChange}
            onConfirmedCoordinates={handleConfirmedCoordinates}
          />
        </div>

        <ImageCard
          type="detail"
          postId={postId}
          // images={images}
        />

        <DetailDescription description={description} maxLength={5000000} />

        <button
          onClick={handleUpdate}
          className="w-full mt-8 bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition duration-300 shadow-lg"
        >
          Cập nhật bài đăng
        </button>
      </div>
    </div>
  );
};

export default UpdatePost;
