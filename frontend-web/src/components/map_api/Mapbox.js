import React, { useState, useEffect, useRef } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaMapMarkerAlt, FaMap } from "react-icons/fa";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYW5odnUyMjYiLCJhIjoiY20zaWl0ejcxMDFicDJrcTU5ZTM5N3dnZiJ9.UDrE_KkeeK4BDb4qcmCYHg";

const mapStyles = {
  Streets: "mapbox://styles/mapbox/streets-v11", // Đường phố
  Outdoors: "mapbox://styles/mapbox/outdoors-v11", // Ngoài trời
  Light: "mapbox://styles/mapbox/light-v10", // Sáng
  Dark: "mapbox://styles/mapbox/dark-v10", // Tối
  Satellite: "mapbox://styles/mapbox/satellite-v9", // Vệ tinh
  "Satellite Streets": "mapbox://styles/mapbox/satellite-streets-v11", // Vệ tinh và Đường phố
  "Navigation Day": "mapbox://styles/mapbox/navigation-day-v1", // Điều hướng ban ngày
  "Navigation Night": "mapbox://styles/mapbox/navigation-night-v1", // Điều hướng ban đêm
};

const mapStyleNames = {
  Streets: "Đường phố",
  Outdoors: "Ngoài trời",
  Light: "Sáng",
  Dark: "Tối",
  Satellite: "Vệ tinh",
  "Satellite Streets": "Vệ tinh và Đường phố",
  "Navigation Day": "Điều hướng ban ngày",
  "Navigation Night": "Điều hướng ban đêm",
};

const MapView = ({ longitude, latitude }) => {
  const [isValidCoordinates, setIsValidCoordinates] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    latitude: latitude || 16.07470983524796,
    longitude: longitude || 108.15221889239507,
    zoom: 18,
  });
  const [markerPosition, setMarkerPosition] = useState({
    latitude: latitude || 16.07470983524796,
    longitude: longitude || 108.15221889239507,
  });
  const [mapStyle, setMapStyle] = useState(mapStyles.Streets);

  const mapRef = useRef(null);

  useEffect(() => {
    if (longitude && latitude) {
      setIsValidCoordinates(true);
      const newLatitude = parseFloat(latitude);
      const newLongitude = parseFloat(longitude);

      setMapCenter({
        latitude: newLatitude,
        longitude: newLongitude,
        zoom: 18,
      });
      setMarkerPosition({
        latitude: newLatitude,
        longitude: newLongitude,
      });

      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [newLongitude, newLatitude],
          zoom: 19,
          speed: 0.5,
          curve: 1.52,
        });
      }
    } else {
      setIsValidCoordinates(false);
    }
  }, [longitude, latitude]);

  const handleMapStyleChange = (event) => {
    setMapStyle(mapStyles[event.target.value]);
  };

  return (
    <div className="mb-6 mt-[3rem] w-[32rem] ">
      <div className="p-6 bg-white border-solid border-gray-300 border-[2px] rounded-lg shadow-lg w-[32rem] ">
        <div className="border-b-[2px] border-gray-300 border-solid">
          <h2 className="text-2xl font-extrabold text-red-600 mb-6 text-center flex items-center justify-center gap-2">
            <FaMap className="text-red-600 text-2xl" />
            Vị trí bất động sản
          </h2>
        </div>
        <div className="mt-4">
          <label className="block mb-2 text-lg text-gray-800 font-bold">
            Chọn kiểu bản đồ:
          </label>
          <select
            onChange={handleMapStyleChange}
            className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm bg-white transition duration-300 ease-in-out transform hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {Object.keys(mapStyles).map((style) => (
              <option key={style} value={style}>
                {mapStyleNames[style]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bản đồ */}
      <div className="border-double border-gray-300 border-[2px] shadow-md">
        {isValidCoordinates ? (
          <Map
            ref={mapRef}
            initialViewState={mapCenter}
            style={{ width: "100%", height: "500px" }}
            mapStyle={mapStyle}
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            <Marker
              latitude={markerPosition.latitude}
              longitude={markerPosition.longitude}
              anchor="bottom"
            >
              <FaMapMarkerAlt size={40} color="red" />
              <p className="font-bold text-lg text-red-500">Vị trí BĐS</p>
            </Marker>
          </Map>
        ) : (
          <div className="flex items-center justify-center h-[500px] text-gray-500">
            Chủ bài đăng chưa cập nhật vị trí trên bản đồ
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
