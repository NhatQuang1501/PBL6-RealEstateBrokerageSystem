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
} from "@fortawesome/free-solid-svg-icons";
import "react-quill/dist/quill.snow.css";

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
  description,
  longitude,
  latitude,
  land_lot,
  land_parcel,
  map_sheet_number,
  length,
  width,
}) => {
  const formatPrice = (price) => {
    if (price >= 1_000_000_000) {
      const billionValue = price / 1_000_000_000;
      return Number.isInteger(billionValue)
        ? `${billionValue} tỷ VNĐ`
        : `${billionValue.toFixed(1)} tỷ VNĐ`;
    } else if (price >= 1_000_000) {
      const millionValue = price / 1_000_000;
      return Number.isInteger(millionValue)
        ? `${millionValue} triệu VNĐ`
        : `${millionValue.toFixed(3)} triệu VNĐ`;
    } else {
      return `${price} VNĐ`;
    }
  };

  const infoItems = [
    {
      icon: faRulerCombined,
      label: "Diện tích",
      value: area ? `${area} m²` : null,
      imageUrl:
        "https://uploads-ssl.webflow.com/5c9e5fc6215b2b288eb5937d/5ce35bac5960482835eb254f_enc-home-works-inspections-north-carolina-land-surveying.jpg",
    },
    {
      icon: faRulerCombined,
      label: "Chiều dài",
      value: length ? `${length} m` : null,
      imageUrl:
        "https://uploads-ssl.webflow.com/5c9e5fc6215b2b288eb5937d/5ce35bac5960482835eb254f_enc-home-works-inspections-north-carolina-land-surveying.jpg",
    },
    {
      icon: faRulerCombined,
      label: "Chiều rộng",
      value: width ? `${width} m` : null,
      imageUrl:
        "https://uploads-ssl.webflow.com/5c9e5fc6215b2b288eb5937d/5ce35bac5960482835eb254f_enc-home-works-inspections-north-carolina-land-surveying.jpg",
    },
    {
      icon: faFileContract,
      label: "Pháp lý",
      value: legal_status,
      imageUrl:
        "https://thehollywoodlawyer.com/wp-content/uploads/2023/02/business-lawyer-is-currently-counseling-the-client-2022-12-16-03-44-23-utc-min-scaled.jpg",
    },
    {
      icon: faFileContract,
      label: "Lô đất",
      value: land_lot,
      imageUrl:
        "https://img.iproperty.com.my/angel-legacy-bds/750x1000-fit/2022/08/12/JGcIp0rf/20220812134212-c629.jpg",
    },
    {
      icon: faFileContract,
      label: "Thửa đất số",
      value: land_parcel,
      imageUrl:
        "https://th.bing.com/th/id/OIP.xNtY1MNes6NAf3eGPPSo5QAAAA?rs=1&pid=ImgDetMain",
    },
    {
      icon: faFileContract,
      label: "Tờ bản đồ số",
      value: map_sheet_number,
      imageUrl:
        "https://storage.timviec365.vn/timviec365/pictures/images_10_2022/khai-niem.jpg",
    },

    {
      icon: faRoad,
      label: "Mặt tiền",
      value: frontage ? `${frontage} m` : null,
      imageUrl:
        "https://prettyprovidence.com/wp-content/uploads/2015/06/bruno-bergher-157009-unsplash.jpg",
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
      value: floor ? `${floor} tầng` : null,
      imageUrl:
        "https://png.pngtree.com/png-vector/20220812/ourlarge/pngtree-city-vector-png-image_6108104.png",
    },
    {
      icon: faBed,
      label: "Phòng ngủ",
      value: bedroom ? `${bedroom} phòng` : null,
      imageUrl:
        "https://th.bing.com/th/id/R.b8fca2d38b3e11739dad92b98e096117?rik=EbsX8BGDstvtDw&pid=ImgRaw&r=0",
    },
    {
      icon: faBath,
      label: "Phòng tắm",
      value: bathroom ? `${bathroom} phòng` : null,
      imageUrl:
        "https://bowa.com/wp-content/uploads/2017/08/PIN-McLean-VA-IHD-CDB-1910-Whole-Home-Renovation-Bath3-D17159-7886_01-17.jpg",
    },
  ].filter((item) => item.value);

  return (
    <div className="space-y-16 my-12 px-6 bg-gray-200 p-10 rounded-2xl">
      {/* Giá */}
      <div className="flex justify-center">
        <div className="relative p-12 w-full sm:w-3/4 lg:w-4/5 rounded-2xl overflow-hidden bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-2xl hover:scale-105 transform transition-all duration-300">
          <div className="absolute inset-0 bg-black opacity-10 rounded-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-row justify-center items-center gap-2">
            <FontAwesomeIcon icon={faDollarSign} className="text-5xl" />
            <p className="text-3xl font-bold mr-2">Giá:</p>
            <p className="text-5xl font-extrabold">{formatPrice(price)}</p>
          </div>
        </div>
      </div>

      {/* Detail*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {infoItems.map((item, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center p-8 rounded-2xl bg-cover bg-center text-gray-200 shadow-lg transform transition-all duration-350 hover:-translate-y-2 hover:scale-105 hover:text-white"
            style={{ backgroundImage: `url(${item.imageUrl})` }}
          >
            {/* Overlay layer */}
            <div className="absolute inset-0 bg-black opacity-70 rounded-2xl transition-opacity duration-300 hover:opacity-20"></div>

            <div className="relative z-10 text-center transition-colors duration-300 ">
              <FontAwesomeIcon icon={item.icon} className="text-4xl mb-4 " />
              <p className="text-xl font-semibold mb-2">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Khối Địa chỉ và Ghi chú */}
      <div className="flex flex-col items-center p-10 border-[1px] border-dotted border-gray-300 rounded-xl shadow-xl bg-gray-50 hover:bg-gray-100 transition duration-300 max-w-2xl mx-auto">
        <div className="mb-6 flex items-center text-xl">
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            className="text-red-700 mr-3"
          />
          <p className="font-semibold text-gray-700">Địa chỉ</p>
        </div>
        <p className="text-gray-800 text-lg text-center mb-6">
          {`${address}, Phường ${ward}, Quận ${district}, Thành phố ${city}`}
        </p>
        <p className="text-gray-800 text-lg text-center mb-6">
          {`KĐ: ${longitude}, VĐ: ${latitude}`}
        </p>
      </div>
    </div>
  );
};

export default BasicInformation;
