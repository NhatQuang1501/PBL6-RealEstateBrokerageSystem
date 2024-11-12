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
} from "@fortawesome/free-solid-svg-icons";
import AddressInput from "../map_api/AddressInputWithPopup";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppProvider";
import AddImage from "./AddImage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("Đà Nẵng");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [legal_status, setLegal_status] = useState("");
  const [orientation, setOrientation] = useState("");
  const [floor, setFloor] = useState(null);
  const [bedroom, setBedroom] = useState(null);
  const [bathroom, setBathroom] = useState(null);
  const [description, setDescription] = useState("");
  const [frontage, setFrontage] = useState(null);
  const [title, setTitle] = useState("");
  const [sale_status, setSale_status] = useState("");

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
        !district ||
        !city ||
        !price ||
        !area ||
        !legal_status ||
        !orientation ||
        !frontage ||
        !title) &&
      selectedProperty === "land"
    ) {
      alert("Vui lòng điền đầy đủ thông tin !");
      return;
    } else if (
      (!address ||
        !district ||
        !city ||
        !price ||
        !area ||
        !legal_status ||
        !orientation ||
        !frontage ||
        !title ||
        !floor ||
        !bedroom ||
        !bathroom) &&
      selectedProperty === "house"
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
          district: district,
          city: city,
          price: price,
          area: area,
          legal_status: legal_status,
          orientation: orientation,
          floor: floor,
          bedroom: bedroom,
          bathroom: bathroom,
          description: description,
          frontage: frontage,
          title: title,
          sale_status: sale_status,
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
          setShowModal(true);
        } else {
          console.error("post_id is missing in the response data");
        }

        // if (addMoreImages) {
        //   handleUploadImage();
        // } else {
        //   navigate("/user/main-page-user");
        // }
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

  return (
    <div className="mt-5 mb-[10rem] justify-center font-montserrat">
      <div className="flex items-center p-3 space-x-2 w-[20rem] shadow-lg shadow-[#E4FFFC] rounded-[3rem]">
        <FontAwesomeIcon
          icon={faPlus}
          className="text-white bg-[#3CA9F9] p-3 w-5 h-5 rounded-full"
        />
        <h3 className="text-2xl font-bold text-[#3CA9F9] underline">
          Tạo bài đăng
        </h3>
      </div>

      <div className="w-full p-8 mt-8 bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-400 rounded-xl shadow-xl transition-all duration-500 hover:shadow-2xl">
        <button
          className="block text-left"
          onClick={() => (window.location.href = "/user/create-post")}
        >
          <h2 className="text-black font-extrabold p-3">
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
            <h2 className="text-xl font-bold text-black mb-10">
              Thông tin cơ bản
            </h2>
            <form
              className="p-8 rounded-lg shadow-xl bg-gradient-to-r from-blue-50 to-blue-100"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Địa chỉ */}
                <div>
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

                  {/* Quận */}
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="district"
                    >
                      Quận:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="vd: Hải Châu"
                        id="district"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* Giá bán */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="price"
                  >
                    Giá bán (VNĐ):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="vd: 5000000000"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                      icon={faDollarSign}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
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
                      onChange={(e) => setArea(e.target.value)}
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                      icon={faRulerCombined}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

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
                      <option value="Sổ hồng">Sổ hồng</option>
                      <option value="Sổ đỏ">Sổ đỏ</option>
                      <option value="Chưa có">Chưa có</option>
                      <option value="Khác">Khác</option>
                    </select>
                    <FontAwesomeIcon
                      icon={faFileAlt}
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
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Tiêu đề bài đăng */}
                <div className="relative mb-6 md:col-span-2">
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
                          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                          [{ 'align': [] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'color': [] }, { 'background': [] }],
                          ['link'],
                          ['blockquote', 'code-block'],
                          ['image'],
                        ],
                      }}
                      formats={[
                        'header', 'font', 'list', 'align', 'bold', 'italic', 'underline', 'strike', 'color', 'background', 'link', 'blockquote', 'code-block', 'image'
                      ]}
                    />
                    <FontAwesomeIcon
                      icon={faStickyNote}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>
              </div>
              <div className=" w-full flex justify-center">
                <button
                  className="bg-[#3CA9F9] text-white font-semibold rounded-lg px-4 py-2 mt-4 transition duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  // onClick={handleSubmit}
                  type="submit"
                >
                  Đăng bài
                </button>
              </div>
            </form>
            <AddressInput />
          </div>
        )}

        {showForm && selectedProperty === "land" && (
          <div className="transition-all transform translate-y-[-20px]">
            <h2 className="text-xl font-bold text-[#3CA9F9]">
              Thông tin cơ bản
            </h2>
            <form
              className="p-6 rounded-lg shadow-lg bg-white"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Địa chỉ */}
                <div>
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
                        placeholder="vd: 261 Hoàng Thị Loan"
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

                  {/* Quận */}
                  <div className="relative mb-6">
                    <label
                      className="block mb-2 text-gray-800 font-semibold"
                      htmlFor="district"
                    >
                      Quận:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="vd: Liên Chiểu"
                        id="district"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* Giá bán */}
                <div className="relative mb-6">
                  <label
                    className="block mb-2 text-gray-800 font-semibold"
                    htmlFor="price"
                  >
                    Giá bán (VNĐ):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="vd: 5000000000"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                      icon={faDollarSign}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
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
                      onChange={(e) => setArea(e.target.value)}
                      className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                      icon={faRulerCombined}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

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
                      <option value="Sổ hồng">Sổ hồng</option>
                      <option value="Sổ đỏ">Sổ đỏ</option>
                      <option value="Chưa có">Chưa có</option>
                      <option value="Khác">Khác</option>
                    </select>
                    <FontAwesomeIcon
                      icon={faFileAlt}
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
                      placeholder="vd: 10.5"
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
                      placeholder="vd: Bán đất mặt tiền 10m5 ở Đà Nẵng"
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
                          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                          [{ 'align': [] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'color': [] }, { 'background': [] }],
                          ['link'],
                          ['blockquote', 'code-block'],
                          ['image'],
                        ],
                      }}
                      formats={[
                        'header', 'font', 'list', 'align', 'bold', 'italic', 'underline', 'strike', 'color', 'background', 'link', 'blockquote', 'code-block', 'image'
                      ]}
                    />
                    <FontAwesomeIcon
                      icon={faStickyNote}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>
              </div>
              <div className=" w-full flex justify-center">
                <button
                  className="bg-[#3CA9F9] text-white font-semibold rounded-lg px-4 py-2 mt-4 transition duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  // onClick={handleSubmit}
                  type="submit"
                >
                  Đăng bài
                </button>
              </div>
            </form>
            <AddressInput />
          </div>
        )}
      </div>
      {showModal && (
        <AddImage onClose={handleCloseModal} onConfirm={handleConfirmModal} />
      )}
    </div>
  );
};

export default BasicInformation;
