import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faRulerCombined,
  faFileContract,
  faRoad,
  faCompass,
  faBuilding,
  faBed,
  faBath,
  faMapMarkerAlt,
  faStickyNote,
} from "@fortawesome/free-solid-svg-icons";

const BasicInformation = ({
  price,
  area,
  orientation,
  bedroom,
  bathroom,
  floor,
  legal_status,
  frontage,
  address,
  district,
  city,
  description,
}) => {
  const formatPrice = (price) => {
    if (price >= 1_000_000_000) {
      const billionValue = price / 1_000_000_000;
      return Number.isInteger(billionValue)
        ? `${billionValue} tỷ VND`
        : `${billionValue.toFixed(3)} tỷ VND`;
    } else if (price >= 1_000_000) {
      const millionValue = price / 1_000_000;
      return Number.isInteger(millionValue)
        ? `${millionValue} triệu VND`
        : `${millionValue.toFixed(3)} triệu VND`;
    } else {
      return `${price} VND`;
    }
  };

  const infoItems = [
    {
      icon: faRulerCombined,
      label: "Diện tích",
      value: `${area} m²`,
      imageUrl: "path/to/area-image.jpg",
    },
    {
      icon: faFileContract,
      label: "Pháp lý",
      value: legal_status,
      imageUrl: "path/to/legal-image.jpg",
    },
    {
      icon: faRoad,
      label: "Mặt tiền",
      value: `${frontage} m`,
      imageUrl: "path/to/frontage-image.jpg",
    },
    {
      icon: faCompass,
      label: "Hướng",
      value: orientation,
      imageUrl:
        "https://iievietnam.org/wp-content/uploads/2019/10/cac-huong-tieng-anh.jpg",
    },
    {
      icon: faBuilding,
      label: "Số tầng",
      value: `${floor} tầng`,
      imageUrl: "path/to/floor-image.jpg",
    },
    {
      icon: faBed,
      label: "Phòng ngủ",
      value: `${bedroom} phòng`,
      imageUrl: "path/to/bedroom-image.jpg",
    },
    {
      icon: faBath,
      label: "Phòng tắm",
      value: `${bathroom} phòng`,
      imageUrl: "path/to/bathroom-image.jpg",
    },
  ];

  return (
    <div className="space-y-16 my-12 px-6">
      {/* Khối Giá */}
      <div className="flex justify-center">
        <div className="relative p-12 w-full sm:w-3/4 lg:w-1/2 rounded-2xl overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-2xl hover:scale-105 transform transition-all duration-300">
          <div className="absolute inset-0 bg-black opacity-10 rounded-2xl pointer-events-none"></div>
          <div className="relative z-10 text-center">
            <FontAwesomeIcon icon={faDollarSign} className="text-5xl mb-4" />
            <p className="text-3xl font-bold">Giá</p>
            <p className="text-5xl mt-4 font-extrabold">{formatPrice(price)}</p>
          </div>
        </div>
      </div>

      {/* Khối Thông tin chi tiết với ảnh nền */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {infoItems.map((item, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center p-8 rounded-2xl bg-cover bg-center text-gray-200 shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:scale-105"
            style={{ backgroundImage: `url(${item.imageUrl})` }}
          >
            {/* Overlay layer */}
            <div className="absolute inset-0 bg-black opacity-60 rounded-2xl transition-opacity duration-300 hover:opacity-30"></div>

            <div className="relative z-10 text-center transition-colors duration-300">
              <FontAwesomeIcon
                icon={item.icon}
                className="text-4xl mb-4 text-[#FFD700] hover:text-[#FFFFFF]"
              />
              <p className="text-xl font-semibold mb-2 text-[#FFD700] hover:text-[#FFFFFF]">
                {item.label}
              </p>
              <p className="text-2xl font-bold text-[#FFD700] hover:text-[#FFFFFF]">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Khối Địa chỉ và Ghi chú */}
      <div className="flex flex-col items-center p-10 border-[1px] border-dotted border-gray-300 rounded-xl shadow-xl bg-gray-50 hover:bg-gray-100 transition duration-300 max-w-2xl mx-auto">
        <div className="mb-6 flex items-center text-xl">
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            className="text-[#3CA9F9] mr-3"
          />
          <p className="font-semibold text-gray-700">Địa chỉ</p>
        </div>
        <p className="text-gray-800 text-lg text-center mb-6">
          {`${address}, Quận ${district}, Thành phố ${city}`}
        </p>
        <div className="mb-6 flex items-center text-xl">
          <FontAwesomeIcon
            icon={faStickyNote}
            className="text-[#3CA9F9] mr-3"
          />
          <p className="font-semibold text-gray-700">Ghi chú</p>
        </div>
        <p className="text-gray-800 text-lg text-center">{description}</p>
      </div>
    </div>
  );
};

export default BasicInformation;
