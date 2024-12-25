import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faBed,
  faBath,
  faCompass,
  faMapMarkerAlt,
  faCheck,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";

const SideBar = ({
  setFilterLegalValue,
  setFilterOrientationValue,
  setFilterBedroomValue,
  setFilterBathroomValue,
  setFilterDistrictValue,
}) => {
  const [selectedLegals, setSelectedLegals] = useState([]);
  const [selectedOrientations, setSelectedOrientations] = useState([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState([]);
  const [selectedBathrooms, setSelectedBathrooms] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  const handleFilterLegal = (legal) => {
    setSelectedLegals((prevSelected) => {
      if (prevSelected.includes(legal)) {
        return prevSelected.filter((item) => item !== legal);
      } else {
        return [...prevSelected, legal];
      }
    });
  };

  const handleFilterOrientation = (orientation) => {
    setSelectedOrientations((prevSelected) => {
      if (prevSelected.includes(orientation)) {
        return prevSelected.filter((item) => item !== orientation);
      } else {
        return [...prevSelected, orientation];
      }
    });
  };

  const handleFilterBedroom = (bedroom) => {
    setSelectedBedrooms((prevSelected) => {
      if (prevSelected.includes(bedroom)) {
        return prevSelected.filter((item) => item !== bedroom);
      } else {
        return [...prevSelected, bedroom];
      }
    });
  };

  const handleFilterBathroom = (bathroom) => {
    setSelectedBathrooms((prevSelected) => {
      if (prevSelected.includes(bathroom)) {
        return prevSelected.filter((item) => item !== bathroom);
      } else {
        return [...prevSelected, bathroom];
      }
    });
  };

  const handleFilterDistrict = (district) => {
    setSelectedDistricts((prevSelected) => {
      if (prevSelected.includes(district)) {
        return prevSelected.filter((item) => item !== district);
      } else {
        return [...prevSelected, district];
      }
    });
  };

  useEffect(() => {
    setFilterLegalValue(selectedLegals);
  }, [selectedLegals, setFilterLegalValue]);

  useEffect(() => {
    setFilterOrientationValue(selectedOrientations);
  }, [selectedOrientations, setFilterOrientationValue]);

  useEffect(() => {
    setFilterBedroomValue(selectedBedrooms);
  }, [selectedBedrooms, setFilterBedroomValue]);

  useEffect(() => {
    setFilterBathroomValue(selectedBathrooms);
  }, [selectedBathrooms, setFilterBathroomValue]);

  useEffect(() => {
    setFilterDistrictValue(selectedDistricts);
  }, [selectedDistricts, setFilterDistrictValue]);

  return (
    <div className="flex w-[25%] p-4">
      <div className="bg-white border-2 border-gray-300 border-solid w-full max-h-[75vh] mt-2 pb-5 p-5 rounded-xl shadow-lg text-left sticky top-[7rem] overflow-y-auto">
        <h1 className="text-xl font-bold text-gray-600 bg-blue-200 p-3 rounded-lg shadow-xl mb-6 text-center">
          Bộ lọc tìm kiếm
        </h1>

        {/* Legal Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-500 mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faBook} />
            Tình trạng pháp lý
          </h2>
          <ul className="text-black border-gray-300 border-[1px] border-solid rounded-lg">
            {["Sổ đỏ/Sổ hồng", "Chưa có", "Khác"].map((legal, index) => (
              <li
                key={index}
                className={`flex justify-between p-2 rounded-lg opacity-90 cursor-pointer hover:opacity-100 hover:bg-blue-200 transition-all duration-200 ${
                  selectedLegals.includes(legal) ? "bg-gray-500 text-white" : ""
                }`}
                onClick={() => handleFilterLegal(legal)}
              >
                {legal}
                {selectedLegals.includes(legal) && (
                  <FontAwesomeIcon icon={faCheck} className="ml-2" />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Orientation Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-500 mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faCompass} />
            Lọc theo hướng
          </h2>
          <ul className="text-black border-gray-300 border-[1px] border-solid rounded-lg">
            {[
              "Đông",
              "Tây",
              "Nam",
              "Bắc",
              "Đông-Nam",
              "Đông-Bắc",
              "Tây-Bắc",
              "Tây-Nam",
            ].map((orientation, index) => (
              <li
                key={index}
                className={`flex justify-between p-2 rounded-lg opacity-90 cursor-pointer hover:opacity-100 hover:bg-blue-200 transition-all duration-200 ${
                  selectedOrientations.includes(orientation)
                    ? "bg-gray-500 text-white"
                    : ""
                }`}
                onClick={() => handleFilterOrientation(orientation)}
              >
                {orientation}
                {selectedOrientations.includes(orientation) && (
                  <FontAwesomeIcon icon={faCheck} className="ml-2" />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Bedroom Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-500 mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faBed} />
            Lọc theo số phòng ngủ
          </h2>
          <ul className="text-black border-gray-300 border-[1px] border-solid rounded-lg">
            {["1", "2", "3", "4", "5", "Nhiều hơn 5"].map((bedroom, index) => (
              <li
                key={index}
                className={`flex justify-between p-2 rounded-lg opacity-90 cursor-pointer hover:opacity-100 hover:bg-blue-200 transition-all duration-200 ${
                  selectedBedrooms.includes(bedroom)
                    ? "bg-gray-500 text-white"
                    : ""
                }`}
                onClick={() => handleFilterBedroom(bedroom)}
              >
                {bedroom}
                {selectedBedrooms.includes(bedroom) && (
                  <FontAwesomeIcon icon={faCheck} className="ml-2" />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Bathroom Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-500 mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faBath} />
            Lọc theo số phòng tắm
          </h2>
          <ul className="text-black border-gray-300 border-[1px] border-solid rounded-lg">
            {["1", "2", "3", "4", "5", "Nhiều hơn 5"].map((bathroom, index) => (
              <li
                key={index}
                className={`flex justify-between p-2 rounded-lg opacity-90 cursor-pointer hover:opacity-100 hover:bg-blue-200 transition-all duration-200 ${
                  selectedBathrooms.includes(bathroom)
                    ? "bg-gray-500 text-white"
                    : ""
                }`}
                onClick={() => handleFilterBathroom(bathroom)}
              >
                {bathroom}
                {selectedBathrooms.includes(bathroom) && (
                  <FontAwesomeIcon icon={faCheck} className="ml-2" />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Disctrict Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-500 mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            Lọc theo Quận/Huyện
          </h2>
          <ul className="text-black border-gray-300 border-[1px] border-solid rounded-lg">
            {[
              "Liên Chiểu",
              "Hải Châu",
              "Thanh Khê",
              "Sơn Trà",
              "Ngũ Hành Sơn",
              "Cẩm Lệ",
              "Hòa Vang",
            ].map((district, index) => (
              <li
                key={index}
                className={`flex justify-between p-2 rounded-lg opacity-90 cursor-pointer hover:opacity-100 hover:bg-gray-200 transition-all duration-200 ${
                  selectedDistricts.includes(district)
                    ? "bg-gray-500 text-white"
                    : ""
                }`}
                onClick={() => handleFilterDistrict(district)}
              >
                {district}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-100 to-blue-200 text-gray-600 rounded-md">
          <h2 className="text-lg font-semibold flex items-center gap-3 italic">
            <FontAwesomeIcon icon={faLightbulb} />
            Hãy kết hợp lọc nhiều điều kiện để tìm kiếm chính xác hơn !
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
