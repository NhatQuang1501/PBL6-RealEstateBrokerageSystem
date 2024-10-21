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

  return (
    <div className="border-[1px] border-double border-[#3CA9F9] rounded-lg p-4 my-4 min-h-full font-extrabold shadow-md">
      <h4 className="text-[#3CA9F9] text-lg mb-2">Thông tin cơ bản:</h4>
      <div className="flex flex-wrap gap-4 p-4 mt-5 border-[1px] border-[#3CA9F9] border-double rounded-lg justify-center items-start bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400">
        <div className="flex-3 p-2  border-2 border-gray-200 border-double rounded-2xl bg-[#E4FFFC]  transform transition-transform duration-300 hover:-translate-y-1 shadow-md">
          <p className="text-red-500 font-semibold flex items-center">
            <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
            Giá:
          </p>
          <p className="text-[#3CA9F9] mt-2 leading-[1.2]">
            {formatPrice(price)}
          </p>
        </div>
        <div className="flex-1 p-2 border-2 border-gray-200 border-double rounded-2xl bg-[#E4FFFC] transform transition-transform duration-300 hover:-translate-y-1 shadow-md">
          <p className="text-red-500 font-semibold flex items-center">
            <FontAwesomeIcon icon={faRulerCombined} className="mr-2" />
            Diện tích:
          </p>
          <p className="text-[#3CA9F9] mt-2 leading-[1.2]">{area} m2</p>
        </div>
        <div className="flex-1 p-2 border-2 border-gray-200 border-double rounded-2xl bg-[#E4FFFC] transform transition-transform duration-300 hover:-translate-y-1 shadow-md">
          <p className="font-semibold flex items-center">
            <FontAwesomeIcon icon={faFileContract} className="mr-2" />
            Pháp lý:
          </p>
          <p className="text-[#3CA9F9] mt-2 leading-[1.2]">{legal_status}</p>
        </div>
        <div className="flex-1 p-2 border-2 border-gray-200 border-double rounded-2xl bg-[#E4FFFC] transform transition-transform duration-300 hover:-translate-y-1 shadow-md">
          <p className="font-semibold flex items-center">
            <FontAwesomeIcon icon={faRoad} className="mr-2" />
            Mặt tiền:
          </p>
          <p className="text-[#3CA9F9] mt-2 leading-[1.2]">{frontage} m</p>
        </div>
        <div className="flex-1 p-2 border-2 border-gray-200 border-double rounded-2xl bg-[#E4FFFC] transform transition-transform duration-300 hover:-translate-y-1 shadow-md">
          <p className="font-semibold flex items-center">
            <FontAwesomeIcon icon={faCompass} className="mr-2" />
            Hướng:
          </p>
          <p className="text-[#3CA9F9] mt-2 leading-[1.2]">{orientation}</p>
        </div>
        <div className="flex-1 p-2 border-2 border-gray-200 border-double rounded-2xl bg-[#E4FFFC] transform transition-transform duration-300 hover:-translate-y-1 shadow-md">
          <p className="font-semibold flex items-center">
            <FontAwesomeIcon icon={faBuilding} className="mr-2" />
            Số tầng:
          </p>
          <p className="text-[#3CA9F9] mt-2 leading-[1.2]">{floor} tầng</p>
        </div>
        <div className="flex-1 p-2 border-2 border-gray-200 border-double rounded-2xl bg-[#E4FFFC] transform transition-transform duration-300 hover:-translate-y-1 shadow-md">
          <p className="font-semibold flex items-center">
            <FontAwesomeIcon icon={faBed} className="mr-2" />
            Phòng ngủ:
          </p>
          <p className="text-[#3CA9F9] mt-2 leading-[1.2]">{bedroom} phòng</p>
        </div>
        <div className="flex-1 p-2 border-2 border-gray-200 border-double rounded-2xl bg-[#E4FFFC] transform transition-transform duration-300 hover:-translate-y-1 shadow-md">
          <p className="font-semibold flex items-center">
            <FontAwesomeIcon icon={faBath} className="mr-2" />
            Phòng tắm:
          </p>
          <p className="text-[#3CA9F9] mt-2 leading-[1.2]">{bathroom} phòng</p>
        </div>
        <div className="flex-1 p-2 border-2 border-gray-200 border-double rounded-2xl bg-[#E4FFFC] transform transition-transform duration-300 hover:-translate-y-1 shadow-md">
          <p className="font-semibold flex items-center">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
            Địa chỉ:
          </p>
          <p className="text-[#3CA9F9] mt-2 leading-[1.2]">
            {address}, Quận {district}, Thành phố {city}
          </p>
        </div>
        <div className="flex-1 p-2 border-2 border-gray-200 border-double rounded-2xl bg-[#E4FFFC] transform transition-transform duration-300 hover:-translate-y-1 shadow-md">
          <p className="font-semibold flex items-center">
            <FontAwesomeIcon icon={faStickyNote} className="mr-2" />
            Ghi chú:
          </p>
          <p className="text-[#3CA9F9] mt-2 leading-[1.2]">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
