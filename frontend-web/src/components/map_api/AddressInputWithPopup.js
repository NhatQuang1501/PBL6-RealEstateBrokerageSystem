import React, { useState, useEffect, useRef } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYW5odnUyMjYiLCJhIjoiY20zaWl0ejcxMDFicDJrcTU5ZTM5N3dnZiJ9.UDrE_KkeeK4BDb4qcmCYHg";

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

  return (
    <div className="mb-6">
      <div className="relative mb-4">
        <label className="block mb-2 mt-10 text-lg text-gray-800 font-bold">
          Địa chỉ:
        </label>

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

      {/* Nút xác nhận */}
      <button
        onClick={handleConfirmPosition}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
      >
        Xác nhận vị trí
      </button>

      {/* Hiển thị tọa độ */}
      {confirmedPosition && (
        <div className="mt-4 p-6 border border-gray-300 rounded-lg shadow-lg bg-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Tọa độ đã xác nhận:
          </h3>
          <div className="flex items-center mb-2">
            <span className="font-bold text-gray-700 mr-2">Kinh độ:</span>
            <span className="text-gray-600">{confirmedPosition.longitude}</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-gray-700 mr-2">Vĩ độ:</span>
            <span className="text-gray-600">{confirmedPosition.latitude}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressInputWithSuggestions;
