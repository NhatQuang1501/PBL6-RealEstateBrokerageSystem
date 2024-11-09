import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faRuler,
  faBed,
  faCompass,
} from "@fortawesome/free-solid-svg-icons";

const SideBar = () => {
  return (
    <div className="flex w-[25%] p-4">
      <div
        className="bg-white border-2 border-gray-300 border-solid w-full max-h-[75vh] mt-2 pb-5 p-5 rounded-lg shadow-lg text-left sticky top-[7rem] overflow-y-auto"
      >
        <h1 className="text-xl font-bold text-white bg-blue-500 p-3 rounded-2xl shadow-xl mb-6 text-center">
          Bộ lọc tìm kiếm
        </h1>

        {/* Price Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#3CA9F9] mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faDollarSign} />
            Lọc theo khoảng giá
          </h2>
          <ul className="text-gray-700">
            {[
              "Thỏa thuận",
              "Dưới 500 triệu",
              "Dưới 1 tỷ",
              "Dưới 2 tỷ",
              "Dưới 5 tỷ",
            ].map((price, index) => (
              <li
                key={index}
                className="p-2 rounded-lg opacity-90 cursor-pointer hover:opacity-100 hover:bg-[#ebf5ff] transition-all duration-200"
              >
                {price}
              </li>
            ))}
          </ul>
        </div>

        {/* Area Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#3CA9F9] mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faRuler} />
            Lọc theo diện tích
          </h2>
          <ul className="text-gray-700">
            {["Dưới 50 m²", "Dưới 100 m²", "Dưới 200 m²", "Trên 200 m²"].map(
              (area, index) => (
                <li
                  key={index}
                  className="p-2 rounded-lg opacity-90 cursor-pointer hover:opacity-100 hover:bg-[#ebf5ff] transition-all duration-200"
                >
                  {area}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Bedrooms Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#3CA9F9] mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faBed} />
            Lọc theo số phòng ngủ
          </h2>
          <ul className="text-gray-700">
            {[
              "1 phòng ngủ",
              "2 phòng ngủ",
              "3 phòng ngủ",
              "4 phòng ngủ trở lên",
            ].map((room, index) => (
              <li
                key={index}
                className="p-2 rounded-lg opacity-90 cursor-pointer hover:opacity-100 hover:bg-[#ebf5ff] transition-all duration-200"
              >
                {room}
              </li>
            ))}
          </ul>
        </div>

        {/* Direction Filter */}
        <div>
          <h2 className="text-lg font-semibold text-[#3CA9F9] mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faCompass} />
            Lọc theo hướng nhà
          </h2>
          <ul className="text-gray-700">
            {["Đông", "Tây", "Nam", "Bắc"].map((direction, index) => (
              <li
                key={index}
                className="p-2 rounded-lg opacity-90 cursor-pointer hover:opacity-100 hover:bg-[#ebf5ff] transition-all duration-200"
              >
                {direction}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
