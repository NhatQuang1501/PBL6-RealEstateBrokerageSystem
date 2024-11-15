import React, { useState, useEffect, useRef } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYW5odnUyMjYiLCJhIjoiY20zaWl0ejcxMDFicDJrcTU5ZTM5N3dnZiJ9.UDrE_KkeeK4BDb4qcmCYHg"; // Thay bằng token Mapbox của bạn

const AddressInputWithSuggestions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    latitude: 16.047079,
    longitude: 108.20623,
    zoom: 18,
  });

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
    }, 0);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleSuggestionClick = (suggestion) => {
    const { lat, lon } = suggestion;
    const newPosition = [parseFloat(lat), parseFloat(lon)];
    setSearchTerm(suggestion.display_name);
    setSuggestions([]);

    setMapCenter({
      latitude: newPosition[0],
      longitude: newPosition[1],
      zoom: 15,
    });

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [newPosition[1], newPosition[0]],
        zoom: 15,
        speed: 1.2,
        curve: 1.42,
      });
    }
  };

  return (
    <div className="mb-6">
      <div className="relative mb-4">
        <label className="block mb-2 text-lg text-gray-800 font-medium">
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
        latitude={mapCenter.latitude}
        longitude={mapCenter.longitude}
        zoom={mapCenter.zoom}
        style={{ width: "100%", height: "600px" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Marker
          latitude={mapCenter.latitude}
          longitude={mapCenter.longitude}
          anchor="bottom"
        >
          <FaMapMarkerAlt size={40} color="red" />
        </Marker>
      </Map>
    </div>
  );
};

export default AddressInputWithSuggestions;
