import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faMapMarkerAlt,
  faRuler,
  faRulerHorizontal,
  faRulerVertical,
  faFileContract,
  faMapMarkedAlt,
  faMap,
  faHome,
  faCompass,
  faBuilding,
  faBed,
  faBath,
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
  ward,
  district,
  city,
  land_lot,
  land_parcel,
  map_sheet_number,
  length,
  width,
}) => {
const formatPrice = (price) => {
  if (price >= 1_000_000_000) {
    const billionValue = parseFloat((price / 1_000_000_000).toFixed(5));
    return `${billionValue} tỷ VNĐ`;
  } else if (price >= 1_000_000) {
    const millionValue = parseFloat((price / 1_000_000).toFixed(5));
    return `${millionValue} triệu VNĐ`;
  } else {
    return `${price} VNĐ`;
  }
};

  const calculatePricePerSquareMeter = () => {
    if (!price || !area) return null;
    const pricePerM2 = (price / area).toFixed(5);
    return formatPrice(Number(pricePerM2));
  };

  const infoRows = [
    { label: "Diện tích", value: area ? `${area} m²` : null, icon: faRuler },
    {
      label: "Chiều dài",
      value: length ? `${length} m` : null,
      icon: faRulerHorizontal,
    },
    {
      label: "Chiều rộng",
      value: width ? `${width} m` : null,
      icon: faRulerVertical,
    },
    { label: "Pháp lý", value: legal_status, icon: faFileContract },
    { label: "Lô đất", value: land_lot, icon: faMapMarkedAlt },
    { label: "Thửa đất số", value: land_parcel, icon: faMap },
    { label: "Tờ bản đồ số", value: map_sheet_number, icon: faMap },
    {
      label: "Mặt tiền",
      value: frontage ? `${frontage} m` : null,
      icon: faHome,
    },
    { label: "Hướng", value: orientation, icon: faCompass },
    {
      label: "Số tầng",
      value: floor ? `${floor} tầng` : null,
      icon: faBuilding,
    },
    {
      label: "Phòng ngủ",
      value: bedroom ? `${bedroom} phòng` : null,
      icon: faBed,
    },
    {
      label: "Phòng tắm",
      value: bathroom ? `${bathroom} phòng` : null,
      icon: faBath,
    },
  ].filter((row) => row.value);

  return (
    <div className="space-y-8 my-12 rounded-xl">
      {/* Header Section with Price and Address */}
      <div className="">
        <div className="grid md:grid-cols-5 gap-8 items-start">
          {/* Price Section */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-300  border-solid border-gray-200 border-[1px]">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-red-200 shadow-lg">
                <FontAwesomeIcon
                  icon={faDollarSign}
                  className="text-white text-2xl"
                />
              </div>
              <div className="flex-grow">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Giá bán
                </div>
                <div className="text-lg font-semibold text-gray-700 mt-2 leading-relaxed">
                  {formatPrice(price)} VNĐ
                </div>
                {calculatePricePerSquareMeter() && (
                  <div className="text-sm text-gray-500 mt-1">
                    ~ {calculatePricePerSquareMeter()} VNĐ/m²
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="md:col-span-3 bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-300  border-solid border-gray-200 border-[1px]">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-red-300 to-red-500 shadow-lg">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-white text-2xl"
                />
              </div>
              <div className="flex-grow">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Địa chỉ
                </div>
                <div className="font-semibold text-gray-700 mt-2 leading-relaxed">
                  {`${address ? address + ", " : ""}${
                    ward ? "Phường " + ward + ", " : ""
                  }${district ? "Quận " + district + ", " : ""}Thành phố ${
                    city ? city : ""
                  }`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-white overflow-hidden">
        <div className="grid grid-cols-2 gap-4">
          {infoRows.map((row, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 rounded-lg shadow-sm bg-gray-100"
            >
              <FontAwesomeIcon icon={row.icon} className="text-blue-500 w-4" />
              <div className="flex flex-row justify-start w-full">
                <p className="text-sm font-medium text-gray-600">
                  {row.label}:
                </p>
                <p className="text-sm text-gray-900 font-semibold ml-2">
                  {row.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
