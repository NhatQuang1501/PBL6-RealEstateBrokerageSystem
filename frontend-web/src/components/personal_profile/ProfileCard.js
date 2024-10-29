// components/ProfileCard.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppProvider";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faCity,
  faBirthdayCake,
} from "@fortawesome/free-solid-svg-icons";

const ProfileCard = () => {
  const navigate = useNavigate();
  const { id } = useAppContext();
  const [user, setUser] = useState(null);

  const handleUpdateProfile = () => {
    console.log("Update Profile");
    navigate("/user/update-profile");
  };

  useEffect(() => {
    console.log("User ID:", id);
    const fetchUserById = async () => {
      try {
        let url = `http://127.0.0.1:8000/auth/users/${id}/`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        console.log("User data:", data);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserById();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const getDisplayValue = (value) => {
    return value ? (
      value
    ) : (
      <span className="text-gray-400 italic">Chưa cập nhật thông tin</span>
    );
  };

  return (
    <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
      {/* Profile Image */}
      <div className="mb-4 flex justify-center">
        <img
          src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b514e3cf-d394-43fb-be65-1711518576b6/dfn0ve3-906de5ab-99c9-4b44-bea6-93871c92b44c.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2I1MTRlM2NmLWQzOTQtNDNmYi1iZTY1LTE3MTE1MTg1NzZiNlwvZGZuMHZlMy05MDZkZTVhYi05OWM5LTRiNDQtYmVhNi05Mzg3MWM5MmI0NGMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.cg82kq5m0-7VH5b2LoFAUEdWLsLTcdczzsB_nFBjH44"
          alt="profile"
          className="rounded-full w-[12rem] h-[12rem] object-cover"
        />
      </div>

      {/* Contact Button */}
      <button
        className="bg-teal-500 px-4 py-2 rounded-lg w-full mb-4"
        onClick={() => handleUpdateProfile()}
      >
        Cập nhật trang cá nhân
      </button>

      {/* Face Customizer Options */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <p className="mb-4 text-xl font-semibold text-gray-800">
          Thông tin người dùng
        </p>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUser} className="text-blue-500 mr-2" />
            <label className="flex items-center text-gray-700">
              {getDisplayValue(user.user.username)}
            </label>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faEnvelope} className="text-blue-500 mr-2" />
            <label className="flex items-center text-gray-700">
              {getDisplayValue(user.user.email)}
            </label>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUser} className="text-blue-500 mr-2" />
            <label className="flex items-center text-gray-700">
              {getDisplayValue(user.fullname)}
            </label>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faPhone} className="text-blue-500 mr-2" />
            <label className="flex items-center text-gray-700">
              {getDisplayValue(user.phone_number)}
            </label>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCity} className="text-blue-500 mr-2" />
            <label className="flex items-center text-gray-700">
              {getDisplayValue(user.city)}
            </label>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faBirthdayCake}
              className="text-blue-500 mr-2"
            />
            <label className="flex items-center text-gray-700">
              {getDisplayValue(user.birthdate)}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
