import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const AddressPopup = ({ onClose, onAddressSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const mapRef = useRef();
  const debounceTimeoutRef = useRef(null);

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


  // debounce 0.5s
  useEffect(() => {
    if (searchTerm.length < 3) return;

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

  // Marker
  const SetMarker = ({ position }) => {
    const map = useMap();
    if (position) {
      map.setView(position, 13);
      return <Marker position={position} />;
    }
    return null;
  };

  const handleSuggestionClick = (suggestion) => {
    const { lat, lon } = suggestion;
    const newPosition = [parseFloat(lat), parseFloat(lon)];
    setSelectedPosition(newPosition);
    setSearchTerm(suggestion.display_name);
    setSuggestions([]);
    onAddressSelect(suggestion.display_name);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          Đóng
        </button>
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full p-2 border rounded"
            placeholder="Nhập địa chỉ"
          />
          <ul className="suggestions-list">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="cursor-pointer hover:bg-gray-200"
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        </div>

        <MapContainer
          center={[16.047079, 108.20623]}
          zoom={13}
          style={{ height: "600px", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {selectedPosition && <SetMarker position={selectedPosition} />}
        </MapContainer>
      </div>
    </div>
  );
};

const AddressInputWithPopup = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsPopupOpen(false);
  };

return (
  <div className="mb-6">
    <div className="relative mb-4">
      <label className="block mb-2 text-lg text-gray-800 font-medium">
        Địa chỉ:
      </label>
      <input
        type="text"
        value={selectedAddress}
        onClick={() => setIsPopupOpen(true)}
        className="block w-full p-4 border border-gray-300 rounded-lg shadow-sm bg-white transition duration-300 ease-in-out transform hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
        placeholder="Nhấp để kiểm tra địa chỉ bất động sản"
        readOnly
      />

    </div>

    {/* Popup địa chỉ */}
    {isPopupOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-lg shadow-lg relative">
          <button
            onClick={() => setIsPopupOpen(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            ✕
          </button>
          <AddressPopup
            onClose={() => setIsPopupOpen(false)}
            onAddressSelect={handleAddressSelect}
          />
        </div>
      </div>
    )}
  </div>
);

};

export default AddressInputWithPopup;
