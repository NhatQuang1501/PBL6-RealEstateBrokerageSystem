import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faDollarSign,
  faRoad,
  faMapMarkerAlt,
  faCity,
  faRulerCombined,
  faFileAlt,
  faCompass,
  faBuilding,
  faBed,
  faRulerHorizontal,
  faBath,
  faHeading,
  faStickyNote,
  faHome,
  faMap,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";
import AddressInput from "../map_api/AddressInputWithPopup";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppProvider";
import AddImage from "./AddImage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { FaSpinner, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

const BasicInformation = () => {
  let navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const { sessionToken } = useAppContext();

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [post_id, setPost_id] = useState(null);

  //Logic form

  const [estate_type, setEstate_type] = useState("");
  const [address, setAddress] = useState("");
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("Đà Nẵng");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState();
  const [legal_status, setLegal_status] = useState("");
  const [orientation, setOrientation] = useState("");
  const [floor, setFloor] = useState(null);
  const [bedroom, setBedroom] = useState(null);
  const [bathroom, setBathroom] = useState(null);
  const [description, setDescription] = useState("");
  const [frontage, setFrontage] = useState(null);
  const [title, setTitle] = useState("");
  const [sale_status, setSale_status] = useState("");
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [land_lot, setLand_lot] = useState("Chưa có thông tin");
  const [land_parcel, setLand_parcel] = useState("Chưa có thông tin");
  const [map_sheet_number, setMap_sheet_number] = useState("Chưa có thông tin");

  // attribute for AI
  const [width, setWidth] = useState();
  const [length, setLength] = useState();
  const [has_frontage, setHas_frontage] = useState("");
  const [has_car_lane, setHas_car_lane] = useState("");
  const [has_rear_expansion, setHas_rear_expansion] = useState("");

  const [predictedPrice, setPredictedPrice] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filteredWards, setFilteredWards] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [compulsory, setCompulsory] = useState(false);

  useEffect(() => {
    if (selectedProperty === "house") {
      setEstate_type("Nhà");
    } else if (selectedProperty === "land") {
      setEstate_type("Đất");
    }
    setSale_status("Đang bán");
  }, [selectedProperty]);

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleSelectProperty = (property) => {
    setSelectedProperty(property);

    setTimeout(() => {
      setShowForm(true);
      window.scrollTo({
        top: 200,
        behavior: "smooth",
      });
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      (!address ||
        !ward ||
        !district ||
        !city ||
        !price ||
        !area ||
        (!legal_status && legal_status !== "Sổ đỏ/Sổ hồng") ||
        !orientation ||
        !frontage ||
        !width ||
        !length ||
        !has_frontage ||
        !has_car_lane ||
        !has_rear_expansion ||
        !title ||
        !longitude ||
        !latitude) &&
      selectedProperty === "land"
    ) {
      alert("Vui lòng điền đầy đủ thông tin !");
      return;
    } else if (
      (!address ||
        !ward ||
        !district ||
        !city ||
        !price ||
        !area ||
        (!legal_status && legal_status !== "Sổ đỏ/Sổ hồng") ||
        !orientation ||
        !frontage ||
        !width ||
        !length ||
        !title ||
        !floor ||
        !bedroom ||
        !bathroom ||
        !longitude ||
        !latitude) &&
      selectedProperty === "house"
    ) {
      alert("Vui lòng điền đầy đủ thông tin !");
      return;
    } else if (
      address &&
      ward &&
      district &&
      city &&
      price &&
      area &&
      legal_status === "Sổ đỏ/Sổ hồng" &&
      (land_lot === "Chưa có thông tin" ||
        land_parcel === "Chưa có thông tin" ||
        map_sheet_number === "Chưa có thông tin") &&
      orientation &&
      frontage &&
      width &&
      length &&
      title &&
      floor &&
      bedroom &&
      bathroom &&
      longitude &&
      latitude &&
      selectedProperty === "house"
    ) {
      alert("Vui lòng điền đầy đủ thông tin !");
      return;
    } else if (
      address &&
      ward &&
      district &&
      city &&
      price &&
      area &&
      legal_status === "Sổ đỏ/Sổ hồng" &&
      (land_lot === "Chưa có thông tin" ||
        land_parcel === "Chưa có thông tin" ||
        map_sheet_number === "Chưa có thông tin") &&
      orientation &&
      frontage &&
      width &&
      length &&
      has_frontage &&
      has_car_lane &&
      has_rear_expansion &&
      title &&
      longitude &&
      latitude &&
      selectedProperty === "land"
    ) {
      alert("Vui lòng điền đầy đủ thông tin !");
      return;
    }

    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn đăng bài này không?"
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/posts/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          estate_type: estate_type,
          address: address,
          ward: ward,
          district: district,
          city: city,
          price: price.replace(/,/g, ""),
          area: area,
          legal_status: legal_status,
          land_lot: land_lot,
          land_parcel: land_parcel,
          map_sheet_number: map_sheet_number,
          orientation: orientation,
          floor: floor,
          bedroom: bedroom,
          bathroom: bathroom,
          description: description,
          frontage: frontage,
          title: title,
          sale_status: sale_status,
          longitude: longitude,
          latitude: latitude,
          width: width,
          length: length,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Đăng bài thành công!");
        alert("Đăng bài thành công!");
        console.log(data);
        // Ensure that `data.post_id` exists and is correctly accessed
        const postId = data.post_id || data.data?.post_id || data.post?.id;
        if (postId) {
          setPost_id(postId); // This will update `post_id` state correctly
          console.log("postid ==> ", postId); // Double-check post_id value
          if (legal_status === "Sổ đỏ/Sổ hồng") {
            setCompulsory(true);
          } else {
            setCompulsory(false);
          }
          setShowModal(true);
        } else {
          console.error("post_id is missing in the response data");
        }
      } else {
        console.log("Đăng bài thất bại!");
        alert("Đăng bài thất bại!");
        navigate("/user/create-post");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(`/user/detail-post/${post_id}`);
  };

  const handleConfirmModal = () => {
    setShowModal(false);
    navigate(`/upload-image/${post_id}`);
  };

  const handleCoordinatesChange = (lng, lat) => {
    setLongitude(lng);
    setLatitude(lat);
  };

  const handleConfirmedCoordinates = (lng, lat) => {
    setLongitude(lng);
    setLatitude(lat);
  };

  const handleEnterPrice = (e) => {
    if (
      address &&
      ward &&
      district &&
      city &&
      area &&
      legal_status &&
      orientation &&
      frontage &&
      width &&
      length &&
      floor &&
      bedroom &&
      bathroom &&
      selectedProperty === "house"
    ) {
      // format price
      let value = e.target.value;
      value = value.replace(/[^0-9,]/g, "");
      const numericValue = value.replace(/,/g, "");
      // reformat
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setPrice(formattedValue);
    } else if (
      address &&
      ward &&
      district &&
      city &&
      area &&
      legal_status &&
      orientation &&
      frontage &&
      width &&
      length &&
      has_frontage &&
      has_car_lane &&
      has_rear_expansion &&
      selectedProperty === "land"
    ) {
      // format price
      let value = e.target.value;
      value = value.replace(/[^0-9,]/g, "");
      const numericValue = value.replace(/,/g, "");
      // reformat
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      setPrice(formattedValue);
    } else {
      e.preventDefault();
      console.log("Thông tin còn thiếu: ", {
        address,
        ward,
        district,
        city,
        area,
        legal_status,
        orientation,
        frontage,
        selectedProperty,
        width,
        length,
        has_frontage,
        has_car_lane,
        has_rear_expansion,
      });
      alert("Vui lòng nhập đầy đủ thông tin trước khi nhập giá.");
    }
  };

  const wardToDistrictMap = {
    // Quận Liên Chiểu
    "Hòa Hiệp Bắc": "Liên Chiểu",
    "Hòa Hiệp Nam": "Liên Chiểu",
    "Hòa Khánh Bắc": "Liên Chiểu",
    "Hòa Khánh Nam": "Liên Chiểu",
    "Hòa Minh": "Liên Chiểu",

    // Quận Thanh Khê
    "Tam Thuận": "Thanh Khê",
    "Thanh Khê Tây": "Thanh Khê",
    "Thanh Khê Đông": "Thanh Khê",
    "Xuân Hà": "Thanh Khê",
    "Tân Chính": "Thanh Khê",
    "Chính Gián": "Thanh Khê",
    "Vĩnh Trung": "Thanh Khê",
    "Thạc Gián": "Thanh Khê",
    "An Khê": "Thanh Khê",
    "Hòa Khê": "Thanh Khê",

    // Quận Hải Châu
    "Thanh Bình": "Hải Châu",
    "Thuận Phước": "Hải Châu",
    "Thạch Thang": "Hải Châu",
    "Hải Châu I": "Hải Châu",
    "Hải Châu II": "Hải Châu",
    "Phước Ninh": "Hải Châu",
    "Hòa Thuận Tây": "Hải Châu",
    "Hòa Thuận Đông": "Hải Châu",
    "Nam Dương": "Hải Châu",
    "Bình Hiên": "Hải Châu",
    "Bình Thuận": "Hải Châu",
    "Hòa Cường Bắc": "Hải Châu",
    "Hòa Cường Nam": "Hải Châu",

    // Quận Sơn Trà
    "Thọ Quang": "Sơn Trà",
    "Nại Hiên Đông": "Sơn Trà",
    "Mân Thái": "Sơn Trà",
    "An Hải Bắc": "Sơn Trà",
    "Phước Mỹ": "Sơn Trà",
    "An Hải Tây": "Sơn Trà",
    "An Hải Đông": "Sơn Trà",

    // Quận Ngũ Hành Sơn
    "Mỹ An": "Ngũ Hành Sơn",
    "Khuê Mỹ": "Ngũ Hành Sơn",
    "Hoà Quý": "Ngũ Hành Sơn",
    "Hoà Hải": "Ngũ Hành Sơn",

    // Quận Cẩm Lệ
    "Khuê Trung": "Cẩm Lệ",
    "Hòa Phát": "Cẩm Lệ",
    "Hòa An": "Cẩm Lệ",
    "Hòa Thọ Tây": "Cẩm Lệ",
    "Hòa Thọ Đông": "Cẩm Lệ",
    "Hòa Xuân": "Cẩm Lệ",

    // Huyện Hòa Vang
    "Hòa Bắc": "Hòa Vang",
    "Hòa Liên": "Hòa Vang",
    "Hòa Ninh": "Hòa Vang",
    "Hòa Sơn": "Hòa Vang",
    "Hòa Nhơn": "Hòa Vang",
    "Hòa Phú": "Hòa Vang",
    "Hòa Phong": "Hòa Vang",
    "Hòa Châu": "Hòa Vang",
    "Hòa Tiến": "Hòa Vang",
    "Hòa Phước": "Hòa Vang",
    "Hòa Khương": "Hòa Vang",
  };

  const allWards = Object.keys(wardToDistrictMap);

  const handleWardChange = (e) => {
    const userInput = e.target.value;
    setWard(userInput);

    // Lọc danh sách Phường/Xã theo giá trị nhập
    const filtered = allWards.filter((wardName) =>
      wardName.toLowerCase().includes(userInput.toLowerCase())
    );
    setFilteredWards(filtered);
    setShowSuggestions(true);

    // Nếu nhập trùng khớp với một Phường/Xã, tự động điền Quận/Huyện
    if (wardToDistrictMap[userInput]) {
      setDistrict(wardToDistrictMap[userInput]);
    } else {
      setDistrict("");
    }
  };
  const handleWardSelect = (wardName) => {
    setWard(wardName);
    setDistrict(wardToDistrictMap[wardName]);
    setShowSuggestions(false);
  };

  // Ẩn gợi ý khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".ward-input-container")) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // dùng AI để dự đoán giá đất khi người dùng nhập đủ các trường thông tin
  useEffect(() => {
    const predictPrice = async () => {
      if (
        selectedProperty === "land" &&
        width &&
        length &&
        has_frontage &&
        has_car_lane &&
        has_rear_expansion &&
        orientation &&
        ward &&
        area
      ) {
        const sanitizedWard = ward.includes("Hòa")
          ? ward.replace(/Hòa/g, "Hoà")
          : ward;

        setLoading(true);
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/api/predict-price/",
            {
              width,
              length,
              has_frontage: has_frontage ? 1 : 0,
              has_car_lane: has_car_lane ? 1 : 0,
              has_rear_expansion: has_rear_expansion ? 1 : 0,
              orientation,
              ward: sanitizedWard,
              area,
            }
          );
          setPredictedPrice(response.data.predicted_price);
          setError(null);
        } catch (err) {
          console.error("Error predicting price:", err);
          setError(
            "Đã xảy ra lỗi khi dự đoán giá đất. Có vẻ như vị trí bất động sản của bạn nằm ngoài khu vực tính toán của mô hình AI. Vui lòng thử lại với một vị trí khác."
          );
          setPredictedPrice(null);
        } finally {
          setLoading(false);
        }
      }
    };
    predictPrice();
  }, [
    selectedProperty,
    width,
    length,
    has_frontage,
    has_car_lane,
    has_rear_expansion,
    orientation,
    ward,
    area,
  ]);

  // W-L to num
  const handleWidthChange = (e) => {
    const numericValue = parseFloat(e.target.value);
    if (!isNaN(numericValue)) {
      setWidth(numericValue);
    } else {
      setWidth("");
    }
  };

  const handleLengthChange = (e) => {
    const numericValue = parseFloat(e.target.value);
    if (!isNaN(numericValue)) {
      setLength(numericValue);
    } else {
      setLength("");
    }
  };

  const handleAreaChange = (e) => {
    const numericValue = parseFloat(e.target.value);
    if (!isNaN(numericValue)) {
      setArea(numericValue);
    } else {
      setArea("");
    }
  };

  return (
    <div className="mt-5 mb-[10rem] justify-center font-montserrat">
      <div className="flex items-center p-3 space-x-2 w-[20rem]">
        <FontAwesomeIcon
          icon={faPlus}
          className="text-white bg-gray-500 p-3 w-5 h-5 rounded-full"
        />
        <h3 className="text-2xl font-bold text-gray-500 underline">
          Tạo bài đăng
        </h3>
      </div>

      <div className="w-full p-8 mt-8 rounded-xl shadow-xl transition-all duration-500 hover:shadow-2xl bg-gray-200">
        <button
          className="block text-left"
          onClick={() => (window.location.href = "/user/create-post")}
        >
          {/* <h2 className="text-black font-extrabold">
            Chọn loại hình bất động sản:
          </h2> */}
          <h2 className="text-xl font-bold text-gray-500 mb-10">
            Chọn loại hình bất động sản:
          </h2>
        </button>

        <div className="flex flex-row justify-center gap-[7rem] pb-10">
          {/* Ảnh nhà */}
          <div
            className={`relative group transition-all duration-500 hover:-translate-y-2 rounded-[7rem] cursor-pointer ${
              selectedProperty === "house"
                ? "translate-x-[60%] scale-100"
                : selectedProperty
                ? "opacity-0 translate-x-[20rem]"
                : ""
            }`}
            onClick={() => handleSelectProperty("house")}
            style={{
              visibility:
                selectedProperty === "house" || !selectedProperty
                  ? "visible"
                  : "hidden",
            }}
          >
            <img
              src="https://th.bing.com/th/id/R.d2a57ccd3e425a765264c5f40c30ee59?rik=H5TNgjOrf5EDRA&pid=ImgRaw&r=0"
              alt="room_image"
              className="w-[30rem] h-[20rem] object-cover rounded-[6rem] shadow-2xl m-5 group-hover:opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-white text-2xl font-bold pointer-events-none">
                Bạn muốn bán nhà ?
              </span>
            </div>
          </div>

          {/* Ảnh đất */}
          <div
            className={`relative group transition-all duration-500 hover:-translate-y-2 rounded-[7rem] cursor-pointer ${
              selectedProperty === "land"
                ? "translate-x-[-60%] scale-100"
                : selectedProperty
                ? "opacity-0 -translate-x-[20rem]"
                : ""
            }`}
            onClick={() => handleSelectProperty("land")}
            style={{
              visibility:
                selectedProperty === "land" || !selectedProperty
                  ? "visible"
                  : "hidden",
            }}
          >
            <img
              src="https://static.chotot.com/storage/chotot-kinhnghiem/nha/2021/12/b039cc56-ban-dat-1-e1638373452143.webp"
              alt="room_image"
              className="w-[30rem] h-[20rem] object-cover rounded-[6rem] shadow-2xl m-5 group-hover:opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-white text-2xl font-bold pointer-events-none">
                Bạn muốn bán đất ?
              </span>
            </div>
          </div>
        </div>

        {/* Handle select */}
        {showForm && selectedProperty === "house" && (
          <div className="transition-all transform translate-y-[-20px]">
            <h2 className="text-xl font-bold text-gray-500 mb-10">
              Thông tin cơ bản
            </h2>
            <form className="p-8 rounded-lg shadow-xl" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Địa chỉ */}
                <div className="">
                  {/* Tên đường */}
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="address"
                    >
                      Tên đường:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="vd: 245 Hoàng Văn Thụ"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FontAwesomeIcon
                        icon={faRoad}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Phường/Xã */}
                  <div className="relative mb-6 ward-input-container">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="ward"
                    >
                      Phường/Xã:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="ward"
                        value={ward}
                        onChange={handleWardChange}
                        onFocus={() => setShowSuggestions(true)}
                        required
                        placeholder="Nhập Phường/Xã"
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md"
                      />
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                      {/* Gợi ý */}
                      {showSuggestions && filteredWards.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1 max-h-60 overflow-auto">
                          {filteredWards.map((wardName) => (
                            <li
                              key={wardName}
                              onClick={() => handleWardSelect(wardName)}
                              className="cursor-pointer hover:bg-gray-200 p-2"
                            >
                              {wardName}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Quận/Huyện */}
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="district"
                    >
                      Quận/Huyện:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Quận/Huyện"
                        id="district"
                        value={district}
                        readOnly
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md"
                      />
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Thành phố */}
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="city"
                    >
                      Thành phố:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        required
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FontAwesomeIcon
                        icon={faCity}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="">
                  {/* Tình trạng pháp lý */}
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="legal_status"
                    >
                      Tình trạng pháp lý:
                    </label>
                    <div className="relative">
                      <select
                        className="block w-full p-2 pl-10 border rounded transition duration-300 ease-in-out transform hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="legal_status"
                        value={legal_status}
                        onChange={(e) => setLegal_status(e.target.value)}
                      >
                        <option value="" disabled hidden>
                          Chọn tình trạng pháp lý
                        </option>
                        <option value="Sổ đỏ/Sổ hồng">Sổ đỏ/Sổ hồng</option>
                        <option value="Chưa có">Chưa có</option>
                        <option value="Khác">Khác</option>
                      </select>
                      <FontAwesomeIcon
                        icon={faFileAlt}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Lô đất */}
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="land_lot"
                    >
                      Lô đất:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="vd: Lô A1-30"
                        id="land_lot"
                        value={land_lot}
                        onChange={(e) => setLand_lot(e.target.value)}
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FontAwesomeIcon
                        icon={faHome}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Thửa đất */}
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="land_parcel"
                    >
                      Thửa đất số:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="vd: 5"
                        id="land_parcel"
                        value={land_parcel}
                        onChange={(e) => setLand_parcel(e.target.value)}
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FontAwesomeIcon
                        icon={faFileInvoice}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Bản đồ số */}
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="map_sheet_number"
                    >
                      Tờ bản đồ số:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="vd: 3"
                        id="map_sheet_number"
                        value={map_sheet_number}
                        onChange={(e) => setMap_sheet_number(e.target.value)}
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FontAwesomeIcon
                        icon={faMap}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Diện tích */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="area"
                  >
                    Diện tích (m2):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="vd: 100"
                      min="0"
                      id="area"
                      value={area}
                      // onChange={(e) => setArea(e.target.value)}
                      onChange={handleAreaChange}
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                      icon={faRulerCombined}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Hướng */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="orientation"
                  >
                    Hướng nhà:
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="orientation"
                      value={orientation}
                      onChange={(e) => setOrientation(e.target.value)}
                    >
                      <option value="" disabled hidden>
                        Chọn hướng nhà
                      </option>
                      <option value="Đông">Đông</option>
                      <option value="Tây">Tây</option>
                      <option value="Nam">Nam</option>
                      <option value="Bắc">Bắc</option>
                      <option value="Đông-Bắc">Đông-Bắc</option>
                      <option value="Đông-Nam">Đông-Nam</option>
                      <option value="Tây-Bắc">Tây-Bắc</option>
                      <option value="Tây-Nam">Tây-Nam</option>
                    </select>
                    <FontAwesomeIcon
                      icon={faCompass}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Số tầng */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="floor"
                  >
                    Số tầng:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="vd: 2"
                      min="0"
                      id="floor"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                      icon={faBuilding}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Số phòng ngủ */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="bedroom"
                  >
                    Số phòng ngủ:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="vd: 3"
                      min="0"
                      id="bedroom"
                      value={bedroom}
                      onChange={(e) => setBedroom(e.target.value)}
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                      icon={faBed}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Số phòng tắm */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="bathroom"
                  >
                    Số phòng tắm:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="vd: 2"
                      min="0"
                      id="bathroom"
                      value={bathroom}
                      onChange={(e) => setBathroom(e.target.value)}
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                      icon={faBath}
                      className="absolute left-3 top-1/2 transform-translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Chiều rộng */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="width"
                  >
                    Chiều rộng (m):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="vd: 5"
                      min="0"
                      step="any"
                      id="width"
                      value={width}
                      // onChange={(e) => setWidth(e.target.value)}
                      onChange={handleWidthChange}
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                      icon={faRulerHorizontal}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Chiều dài */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="length"
                  >
                    Chiều dài (m):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="vd: 5"
                      min="0"
                      step="any"
                      id="length"
                      value={length}
                      // onChange={(e) => setLength(e.target.value)}
                      onChange={handleLengthChange}
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                      icon={faRulerHorizontal}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Đất mặt tiền */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="has_frontage"
                  >
                    Đất mặt tiền ?
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="has_frontage"
                      value={has_frontage}
                      onChange={(e) => setHas_frontage(e.target.value)}
                    >
                      <option value="" disabled hidden>
                        Chọn
                      </option>
                      <option value="1">Có</option>
                      <option value="0">Không</option>
                    </select>
                    <FontAwesomeIcon
                      icon={faHome}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>
                {/* Đường ô tô vào */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="has_car_lane"
                  >
                    Đường ô tô có thể vào ?
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="has_car_lane"
                      value={has_car_lane}
                      onChange={(e) => setHas_car_lane(e.target.value)}
                    >
                      <option value="" disabled hidden>
                        Chọn
                      </option>
                      <option value="1">Có</option>
                      <option value="0">Không</option>
                    </select>
                    <FontAwesomeIcon
                      icon={faRoad}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Đất nở hậu */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="has_rear_expansion"
                  >
                    Đất nở hậu ?
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="has_rear_expansion"
                      value={has_rear_expansion}
                      onChange={(e) => setHas_rear_expansion(e.target.value)}
                    >
                      <option value="" disabled hidden>
                        Chọn
                      </option>
                      <option value="1">Có</option>
                      <option value="0">Không</option>
                    </select>
                    <FontAwesomeIcon
                      icon={faRoad}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Mặt tiền */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="frontage"
                  >
                    Mặt tiền (m):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="vd: 5.5"
                      min="0"
                      step="any"
                      id="frontage"
                      value={frontage}
                      onChange={(e) => setFrontage(e.target.value)}
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                      icon={faRulerHorizontal}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Tiêu đề bài đăng */}
                <div className="relative mb-6 md:col-span-2">
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="price"
                    >
                      Giá bán (VNĐ):
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="vd: 5,000,000,000"
                        id="price"
                        value={price}
                        onChange={handleEnterPrice}
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FontAwesomeIcon
                        icon={faDollarSign}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>

                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="title"
                  >
                    Tiêu đề bài đăng:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="vd: Bán nhà 3 tầng ở Đà Nẵng"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                      icon={faHeading}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Ghi chú */}
                <div className="relative mb-6 md:col-span-2">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="description"
                  >
                    Ghi chú:
                  </label>
                  <div className="relative">
                    {/* <textarea
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={description}
                      placeholder="Nhập ghi chú cho bài đăng của bạn"
                      id="description"
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea> */}
                    <ReactQuill
                      value={description}
                      onChange={handleDescriptionChange}
                      placeholder="Nhập ghi chú cho bài đăng của bạn"
                      modules={{
                        toolbar: [
                          [{ header: "1" }, { header: "2" }, { font: [] }],
                          [{ list: "ordered" }, { list: "bullet" }],
                          [{ align: [] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ color: [] }, { background: [] }],
                          ["link"],
                          ["blockquote", "code-block"],
                          ["image"],
                        ],
                      }}
                      formats={[
                        "header",
                        "font",
                        "list",
                        "align",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "color",
                        "background",
                        "link",
                        "blockquote",
                        "code-block",
                        "image",
                      ]}
                    />
                    <FontAwesomeIcon
                      icon={faStickyNote}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>
              </div>
              <AddressInput
                street={address}
                onCoordinatesChange={handleCoordinatesChange}
                onConfirmedCoordinates={handleConfirmedCoordinates}
              />
              <div className=" w-full flex justify-center border-t-[2px] border-gray-500 border-solid">
                <button
                  className="bg-gray-500 text-white font-semibold rounded-lg px-4 py-2 mt-4 transition duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  // onClick={handleSubmit}
                  type="submit"
                >
                  Đăng bài
                </button>
              </div>
            </form>
          </div>
        )}

        {showForm && selectedProperty === "land" && (
          <div className="transition-all transform translate-y-[-20px]">
            <h2 className="text-xl font-bold text-gray-500 mb-10">
              Thông tin cơ bản
            </h2>
            <form className="p-6 rounded-lg" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Địa chỉ */}
                <div className="">
                  {/* Tên đường */}
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="address"
                    >
                      Tên đường:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="vd: 245 Hoàng Văn Thụ"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FontAwesomeIcon
                        icon={faRoad}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Phường/Xã */}
                  <div className="relative mb-6 ward-input-container">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="ward"
                    >
                      Phường/Xã:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="ward"
                        value={ward}
                        onChange={handleWardChange}
                        onFocus={() => setShowSuggestions(true)}
                        required
                        placeholder="Nhập Phường/Xã"
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md"
                      />
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                      {/* Gợi ý */}
                      {showSuggestions && filteredWards.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1 max-h-60 overflow-auto">
                          {filteredWards.map((wardName) => (
                            <li
                              key={wardName}
                              onClick={() => handleWardSelect(wardName)}
                              className="cursor-pointer hover:bg-gray-200 p-2"
                            >
                              {wardName}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Quận/Huyện */}
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="district"
                    >
                      Quận/Huyện:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Quận/Huyện"
                        id="district"
                        value={district}
                        readOnly
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md"
                      />
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Thành phố */}
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="city"
                    >
                      Thành phố:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        required
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FontAwesomeIcon
                        icon={faCity}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="">
                  {/* Tình trạng pháp lý */}
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="legal_status"
                    >
                      Tình trạng pháp lý:
                    </label>
                    <div className="relative">
                      <select
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="legal_status"
                        value={legal_status}
                        onChange={(e) => setLegal_status(e.target.value)}
                      >
                        <option value="" disabled hidden>
                          Chọn tình trạng pháp lý
                        </option>
                        <option value="Sổ đỏ/Sổ hồng">Sổ đỏ/Sổ hồng</option>
                        <option value="Chưa có">Chưa có</option>
                        <option value="Khác">Khác</option>
                      </select>
                      <FontAwesomeIcon
                        icon={faFileAlt}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Lô đất */}
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="land_lot"
                    >
                      Lô đất:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="vd: Lô A1-30"
                        id="land_lot"
                        value={land_lot}
                        onChange={(e) => setLand_lot(e.target.value)}
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FontAwesomeIcon
                        icon={faHome}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Thửa đất */}
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="land_parcel"
                    >
                      Thửa đất số:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="vd: 5"
                        id="land_parcel"
                        value={land_parcel}
                        onChange={(e) => setLand_parcel(e.target.value)}
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Bản đồ số */}
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="map_sheet_number"
                    >
                      Tờ bản đồ số:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="vd: 3"
                        id="map_sheet_number"
                        value={map_sheet_number}
                        onChange={(e) => setMap_sheet_number(e.target.value)}
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Diện tích */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="area"
                  >
                    Diện tích (m2):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="vd: 100"
                      min="0"
                      id="area"
                      value={area}
                      // onChange={(e) => setArea(e.target.value)}
                      onChange={handleAreaChange}
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                      icon={faRulerCombined}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Hướng */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="orientation"
                  >
                    Hướng đất:
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="orientation"
                      value={orientation}
                      onChange={(e) => setOrientation(e.target.value)}
                    >
                      <option value="" disabled hidden>
                        Chọn hướng đất
                      </option>
                      <option value="Đông">Đông</option>
                      <option value="Tây">Tây</option>
                      <option value="Nam">Nam</option>
                      <option value="Bắc">Bắc</option>
                      <option value="Đông-Bắc">Đông-Bắc</option>
                      <option value="Đông-Nam">Đông-Nam</option>
                      <option value="Tây-Bắc">Tây-Bắc</option>
                      <option value="Tây-Nam">Tây-Nam</option>
                    </select>
                    <FontAwesomeIcon
                      icon={faCompass}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Mặt tiền */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="frontage"
                  >
                    Mặt tiền (m):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="vd: 5.5"
                      min="0"
                      step="any"
                      id="frontage"
                      value={frontage}
                      onChange={(e) => setFrontage(e.target.value)}
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                      icon={faRulerHorizontal}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Chiều rộng */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="width"
                  >
                    Chiều rộng (m):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="vd: 5"
                      min="0"
                      step="any"
                      id="width"
                      value={width}
                      // onChange={(e) => setWidth(e.target.value)}
                      onChange={handleWidthChange}
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                      icon={faRulerHorizontal}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Chiều dài */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="length"
                  >
                    Chiều dài (m):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="vd: 5"
                      min="0"
                      step="any"
                      id="length"
                      value={length}
                      // onChange={(e) => setLength(e.target.value)}
                      onChange={handleLengthChange}
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                      icon={faRulerHorizontal}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Đất mặt tiền */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="has_frontage"
                  >
                    Đất mặt tiền ?
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="has_frontage"
                      value={has_frontage}
                      onChange={(e) => setHas_frontage(e.target.value)}
                    >
                      <option value="" disabled hidden>
                        Chọn
                      </option>
                      <option value="1">Có</option>
                      <option value="0">Không</option>
                    </select>
                    <FontAwesomeIcon
                      icon={faHome}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>
                {/* Đường ô tô vào */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="has_car_lane"
                  >
                    Đường ô tô có thể vào ?
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="has_car_lane"
                      value={has_car_lane}
                      onChange={(e) => setHas_car_lane(e.target.value)}
                    >
                      <option value="" disabled hidden>
                        Chọn
                      </option>
                      <option value="1">Có</option>
                      <option value="0">Không</option>
                    </select>
                    <FontAwesomeIcon
                      icon={faRoad}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Đất nở hậu */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="has_rear_expansion"
                  >
                    Đất nở hậu ?
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="has_rear_expansion"
                      value={has_rear_expansion}
                      onChange={(e) => setHas_rear_expansion(e.target.value)}
                    >
                      <option value="" disabled hidden>
                        Chọn
                      </option>
                      <option value="1">Có</option>
                      <option value="0">Không</option>
                    </select>
                    <FontAwesomeIcon
                      icon={faRoad}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Tiêu đề bài đăng */}
                <div className="relative mb-6 md:col-span-2">
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="price"
                    >
                      Giá bán (VNĐ):
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="vd: 5,000,000,000"
                        id="price"
                        value={price}
                        onChange={handleEnterPrice}
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FontAwesomeIcon
                        icon={faDollarSign}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </div>
                    {/* Giá trị giá bán đề xuất */}
                    <div className="prediction-result  border border-green-300 p-6 rounded-lg shadow-lg flex items-center space-x-4 mt-5">
                      {loading && (
                        <div className="flex items-center text-blue-500">
                          <FaSpinner className="animate-spin mr-2 text-xl" />
                          <span>Đang dự đoán giá...</span>
                        </div>
                      )}
                      {error && (
                        <div className="flex items-center text-red-500">
                          <FaTimesCircle className="mr-2 text-xl" />
                          <span>{error}</span>
                        </div>
                      )}
                      {predictedPrice && (
                        <div className="flex items-center bg-green-100 border border-green-300 p-6 rounded-lg shadow-lg space-x-4">
                          <FaCheckCircle className="text-4xl text-green-600" />
                          <div>
                            <p className="text-xl text-green-700">
                              Giá bán đề xuất:
                            </p>
                            <p className="text-3xl font-bold text-green-900">
                              {predictedPrice.toLocaleString()} VNĐ
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="title"
                  >
                    Tiêu đề bài đăng:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="vd: Bán nhà 3 tầng ở Đà Nẵng"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                      icon={faHeading}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Ghi chú */}
                <div className="relative mb-6 md:col-span-2">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="description"
                  >
                    Ghi chú:
                  </label>
                  <div className="relative">
                    {/* <textarea
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={description}
                      placeholder="Nhập ghi chú cho bài đăng của bạn"
                      id="description"
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea> */}
                    <ReactQuill
                      value={description}
                      onChange={handleDescriptionChange}
                      placeholder="Nhập ghi chú cho bài đăng của bạn"
                      modules={{
                        toolbar: [
                          [{ header: "1" }, { header: "2" }, { font: [] }],
                          [{ list: "ordered" }, { list: "bullet" }],
                          [{ align: [] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ color: [] }, { background: [] }],
                          ["link"],
                          ["blockquote", "code-block"],
                          ["image"],
                        ],
                      }}
                      formats={[
                        "header",
                        "font",
                        "list",
                        "align",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "color",
                        "background",
                        "link",
                        "blockquote",
                        "code-block",
                        "image",
                      ]}
                    />
                    <FontAwesomeIcon
                      icon={faStickyNote}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>
              </div>
              <AddressInput
                street={address}
                onCoordinatesChange={handleCoordinatesChange}
                onConfirmedCoordinates={handleConfirmedCoordinates}
              />
              <div className=" w-full flex justify-center border-t-[2px] border-gray-500 border-solid">
                <button
                  className="bg-gray-500 text-white font-semibold rounded-lg px-4 py-2 mt-4 transition duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  // onClick={handleSubmit}
                  type="submit"
                >
                  Đăng bài
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      {showModal && (
        <AddImage
          onClose={handleCloseModal}
          onConfirm={handleConfirmModal}
          compulsory={compulsory}
        />
      )}
    </div>
  );
};

export default BasicInformation;
