import React, { useState, useEffect, useRef } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYW5odnUyMjYiLCJhIjoiY20zaWl0ejcxMDFicDJrcTU5ZTM5N3dnZiJ9.UDrE_KkeeK4BDb4qcmCYHg"; // Thay bằng token Mapbox của bạn

const AddressInputWithSuggestions = ({
  street,
  onCoordinatesChange,
  onConfirmedCoordinates,
}) => {
  const [searchTerm, setSearchTerm] = useState(street || "");
  const [suggestions, setSuggestions] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    latitude: 16.07470983524796,
    longitude: 108.15221889239507,
    zoom: 18,
  });
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 16.07470983524796,
    longitude: 108.15221889239507,
  });
  const [confirmedPosition, setConfirmedPosition] = useState(null);

  const debounceTimeoutRef = useRef(null);
  const mapRef = useRef(null);

  const fetchSuggestions = async (query) => {
    if (query.length < 3) return;
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            format: "json",
            q: `${query}, Đà Nẵng, Việt Nam`,
            viewbox: "108.127,16.167,108.279,15.965", // Giới hạn trong Đà Nẵng
            bounded: 1, // Giới hạn trong vùng viewbox
            addressdetails: 1,
          },
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    if (searchTerm.length < 3) {
      setSuggestions([]);
      return;
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(searchTerm);
    }, 200);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm(street || "");
  }, [street]);

  const handleSuggestionClick = (suggestion) => {
    const { lat, lon } = suggestion;
    const newPosition = [parseFloat(lat), parseFloat(lon)];
    if (isNaN(newPosition[0]) || isNaN(newPosition[1])) {
      console.error("Invalid coordinates:", newPosition);
      return;
    }
    setSearchTerm(suggestion.display_name);
    setSuggestions([]);

    setMapCenter({
      latitude: newPosition[0],
      longitude: newPosition[1],
      zoom: 15,
    });

    setMarkerPosition({
      latitude: newPosition[0],
      longitude: newPosition[1],
    });

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [newPosition[1], newPosition[0]],
        zoom: 15,
        speed: 1.2,
        curve: 1.42,
      });
    }

    // Gọi callback function để truyền tọa độ về BasicInformationForm
    onCoordinatesChange(newPosition[1], newPosition[0]);
  };

  const handleMapMove = (event) => {
    const { lat, lng } = event.viewState;
    if (isNaN(lat) || isNaN(lng)) {
      console.error("Invalid coordinates:", { lat, lng });
      return;
    }
    setMarkerPosition({
      latitude: lat,
      longitude: lng,
    });

    // Gọi callback function để truyền tọa độ về BasicInformationForm
    onCoordinatesChange(lng, lat);
  };

  const handleMapRightClick = (event) => {
    const { lngLat } = event;
    const lng = lngLat.lng;
    const lat = lngLat.lat;
    setMarkerPosition({
      latitude: lat,
      longitude: lng,
    });
    setMapCenter({
      latitude: lat,
      longitude: lng,
      zoom: mapCenter.zoom,
    });

    // Gọi callback function để truyền tọa độ về BasicInformationForm
    onCoordinatesChange(lng, lat);
  };

  const handleConfirmPosition = (event) => {
    event.preventDefault(); // Ngăn chặn sự kiện submit mặc định của form
    setConfirmedPosition(markerPosition);
    // Gọi callback function để truyền tọa độ đã xác nhận về BasicInformationForm
    onConfirmedCoordinates(markerPosition.longitude, markerPosition.latitude);
  };

  const handleUseGPS = (e) => {
    e.preventDefault(); // Ngăn chặn sự kiện submit mặc định của form
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({
            latitude,
            longitude,
            zoom: 18,
          });
          setMarkerPosition({
            latitude,
            longitude,
          });

          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 18,
              speed: 1.2,
              curve: 1.42,
            });
          }

          // Gọi callback function để truyền tọa độ về BasicInformationForm
          onCoordinatesChange(longitude, latitude);
        },
        (error) => {
          console.error("Lỗi khi lấy tọa độ:", error);
        }
      );
    } else {
      alert("Trình duyệt của bạn không hỗ trợ định vị GPS.");
    }
  };

  return (
    <div className="mb-6">
      <div className="relative mb-4">
        <label className="block mb-2 text-lg text-gray-800 font-bold">
          Địa chỉ:
        </label>

        <div className="mb-4 p-6 border border-gray-300 rounded-lg shadow-lg bg-blue-50">
          <h2 className="text-lg font-semibold text-blue-600 mb-2">
            Hướng dẫn sử dụng bản đồ
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              <strong className="font-bold pr-1">Nhập địa chỉ:</strong> Địa chỉ
              bạn nhập phía trên sẽ được điền tại đây và hiển thị lên bản đồ.
            </li>
            <li>
              <strong className="font-bold pr-1 ">Xác định vị trí:</strong>{" "}
              <span className="text-red-500 ">
                Tuy nhiên bản đồ chưa thể xác định vị trí tuyệt đối.
              </span>{" "}
              Bạn có thể thao tác trực tiếp trong bản đồ để xác định vị trí
              chính xác của bất động sản. <br></br>{" "}
              <span className="ml-5 leading-relaxed">
                Nếu địa chỉ bạn nhập không được gợi ý trên bản đồ, hãy thử chỉ
                nhập tên đường hoặc thao tác trực tiếp trên bản đồ đến khi hiển
                thị địa chỉ gợi ý.
              </span>
            </li>
            <li>
              <strong className="font-bold pr-1">Di chuyển bản đồ:</strong>{" "}
              Giữ-kéo chuột trái/phải để di chuyển vị trí và xoay bản đồ.
            </li>
            <li>
              <strong className="font-bold pr-1">Phóng to/thu nhỏ:</strong> Sử
              dụng chuột cuộn để điều chỉnh kích thước bản đồ.
            </li>
            <li>
              <strong className="font-bold pr-1">Chọn vị trí:</strong> Click
              chuột phải để chọn vị trí chính xác của bất động sản trên bản đồ.
            </li>
          </ul>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full p-4 border border-gray-300 rounded-lg shadow-sm bg-white transition duration-300 ease-in-out transform hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Nhập địa chỉ bất động sản"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1 max-h-60 overflow-auto">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="cursor-pointer hover:bg-gray-200 p-2"
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bản đồ */}
      <Map
        ref={mapRef}
        initialViewState={mapCenter}
        style={{ width: "100%", height: "500px" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMoveEnd={handleMapMove} // Thêm sự kiện onMoveEnd để cập nhật vị trí marker
        onContextMenu={handleMapRightClick} // Thêm sự kiện onContextMenu để cập nhật vị trí marker khi nhấn chuột phải
      >
        <Marker
          latitude={markerPosition.latitude}
          longitude={markerPosition.longitude}
          anchor="bottom"
        >
          <FaMapMarkerAlt size={40} color="red" />
          <p className="font-bold text-lg text-red-500">Địa chỉ của bạn</p>
        </Marker>
      </Map>
      <div className="flex justify-start gap-10">
        {/* Nút xác nhận */}
        <button
          onClick={handleConfirmPosition}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
        >
          Xác nhận vị trí
        </button>

        {/* Nút sử dụng GPS */}
        <button
          onClick={handleUseGPS}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
        >
          Sử dụng GPS
        </button>
      </div>

      {/* Hiển thị tọa độ */}
      {confirmedPosition && (
        <div className="mt-4 p-6 border border-gray-300 shadow-sm bg-white rounded-xl">
          <p className="text-xl text-gray-800 font-semibold mb-4 flex items-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-green-500 mr-2"
            />
            Tọa độ đã xác nhận
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-red-500 mr-2"
              />
              <p className="text-gray-700">
                <span className="font-medium">Kinh độ:</span>{" "}
                {confirmedPosition.longitude}
              </p>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-blue-500 mr-2"
              />
              <p className="text-gray-700">
                <span className="font-medium">Vĩ độ:</span>{" "}
                {confirmedPosition.latitude}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressInputWithSuggestions;
