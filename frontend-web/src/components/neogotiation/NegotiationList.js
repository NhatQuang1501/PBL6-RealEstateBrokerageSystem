import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../AppProvider";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandshake,
  faUser,
  faDollarSign,
  faCalendarAlt,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const NegotiationList = ({ type }) => {
  const { postId } = useParams();
  const { sessionToken } = useAppContext();

  const [negotiations, setNegotiations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNegotiationId, setSelectedNegotiationId] = useState(null);

  useEffect(() => {
    try {
      const fetchNegotiations = async () => {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/post-negotiations/${postId}/`,
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );
        setNegotiations(response.data.negotiations);
        console.log("===============>", response.data.negotiations);
      };
      fetchNegotiations();
    } catch (error) {
      console.error(error);
    }
  }, [postId, sessionToken]);

  const handleAcceptNegotiation = async (negotiationId) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/accept-negotiations/`,
        {
          negotiation_id: negotiationId,
          is_accepted: true,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Chấp nhận thương lượng thành công !");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (negotiationId) => {
    setSelectedNegotiationId(negotiationId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNegotiationId(null);
  };

  const handleConfirmAccept = () => {
    if (selectedNegotiationId) {
      handleAcceptNegotiation(selectedNegotiationId);
      closeModal();
    }
  };

  return (
    <div className="p-6 bg-white border-solid border-gray-300 border-[2px] rounded-lg shadow-lg w-[32rem] ">
      <div className="border-b-[2px] border-gray-300 border-solid">
        <h2 className="text-2xl font-extrabold text-blue-600 mb-6 text-center flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faHandshake} /> {/* Thêm biểu tượng */}
          Danh sách thương lượng
        </h2>
      </div>

      {negotiations.length > 0 ? (
        <div className="space-y-4 mt-[3rem]">
          {negotiations.map((negotiation) => (
            <div
              key={negotiation.negotiation_id}
              className="bg-blue-100 p-6 border-solid border-gray-300 border-[2px] rounded-lg shadow-lg flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                  {negotiation.user?.fullname || "Chưa có thông tin"}
                  <span className="text-sm text-gray-500">
                    (@{negotiation.user?.username || "Chưa có thông tin"})
                  </span>
                </h3>
                <p className="text-sm text-gray-600 font-semibold flex items-center gap-2 mt-2">
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    className="text-yellow-500"
                  />
                  Mức giá đề xuất:{" "}
                  <span className="text-yellow-600 font-semibold">
                    {parseFloat(negotiation.offer_price || 0).toLocaleString()}{" "}
                    VNĐ
                  </span>
                </p>

                <div
                  className={`text-sm font-semibold mt-2 flex items-center gap-2 ${
                    negotiation.is_accepted ? "text-green-600" : "text-red-600 "
                  }`}
                >
                  <FontAwesomeIcon
                    icon={
                      negotiation.is_accepted ? faCheckCircle : faTimesCircle
                    }
                  />

                  <div
                    className={`p-1 rounded-3xl px-2 ${negotiation.is_accepted
                      ? "bg-green-200"
                      : "bg-red-200"}`}
                  >
                    {negotiation.is_accepted
                      ? "Đã chấp nhận"
                      : "Chưa chấp nhận"}
                  </div>
                  {type === "owner" && !negotiation.is_accepted && (
                    <button
                      className="text-white bg-gradient-to-r from-blue-500 to-blue-400 px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform duration-200 ease-in-out hover:from-blue-600 hover:to-blue-500 ml-[3rem]"
                      onClick={() => openModal(negotiation.negotiation_id)}
                    >
                      Chấp nhận
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 font-semibold flex items-center gap-2 mt-2">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="text-yellow-600"
                  />
                  Ngày thương lượng:{" "}
                  <div className="underline text-gray-450 font-medium">
                    {new Date(negotiation.created_at).toLocaleString("vi-VN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-5 font-bold">
          Chưa có cuộc thương lượng nào !
        </p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">
              Bạn có chắc chắn muốn chấp nhận mức giá thương lượng này?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                onClick={handleConfirmAccept}
              >
                Xác nhận
              </button>
              <button
                className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400"
                onClick={closeModal}
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NegotiationList;
