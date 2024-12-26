/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../AppProvider";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FaStickyNote,
  FaDollarSign,
  FaCalendarAlt,
  FaCreditCard,
} from "react-icons/fa";
import {
  faHandshake,
  faUser,
  faDollarSign,
  faCalendarAlt,
  faCheckCircle,
  faTimesCircle,
  faStickyNote,
  faCreditCard,
  faEllipsisV,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import ReportPopup from "../report/ReportPopup ";

const NegotiationList = ({ type }) => {
  const { postId } = useParams();
  const { id, sessionToken, role } = useAppContext();
  let navigate = useNavigate();

  const [negotiations, setNegotiations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNegotiationId, setSelectedNegotiationId] = useState(null);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [negotiationDate, setNegotiationDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [negotiationNote, setNegotiationNote] = useState("");

  const [proposalID, setProposalID] = useState(null);

  const [sortBy, setSortBy] = useState("average_response_time");
  const [order, setOrder] = useState("desc");
  const [amount, setAmount] = useState("5");

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [reportType, setReportType] = useState("");
  const [isReportPopupOpen, setIsReportPopupOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeReportPopup = () => {
    setIsReportPopupOpen(false);
  };

  const handlePersonalProfileClick = (user_id) => {
    navigate(`/user/profile/${user_id}`);
  };

  const openReportPopup = (type) => {
    setReportType(type);
    setIsReportPopupOpen(true);
  };

  useEffect(() => {
    const fetchNegotiations = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/post-negotiations/${postId}/`,
          {
            params: {
              sort_by: sortBy,
              order: order,
              amount: amount,
            },
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );
        setNegotiations(response.data.negotiations);
        console.log("=====nego===> ", response.data);
      } catch (error) {
        console.error("Error fetching negotiations:", error);
      }
    };

    if (sessionToken) {
      fetchNegotiations();
    }
  }, [postId, sessionToken, sortBy, order, amount]);

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

  // const openModal = (negotiationId) => {
  //   setSelectedNegotiationId(negotiationId);
  //   setIsModalOpen(true);
  // };

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

  // Đề nghị lại
  const [isModalProposalOpen, setIsModalProposalOpen] = useState(false);
  const [selectedNegotiationIdProposal, setSelectedNegotiationIdProposal] =
    useState(null);

  const [proposalPrice, setProposalPrice] = useState("");
  const [proposalDate, setProposalDate] = useState("");
  const [proposalMethod, setProposalMethod] = useState("");
  const [proposalNote, setProposalNote] = useState("");

  // Đề nghị
  const openModalProposal = (negotiationId) => {
    setSelectedNegotiationIdProposal(negotiationId);
    setIsModalProposalOpen(true);
  };

  const closeModalProposal = () => {
    setIsModalProposalOpen(false);
    setSelectedNegotiationIdProposal(null);
    setProposalPrice("");
    setProposalDate("");
    setProposalMethod("");
  };

  const handlePriceChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9,]/g, "");
    const numericValue = value.replace(/,/g, "");
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    setProposalPrice(formattedValue);
  };
  const handleProposalNegotiation = async (negotiationId) => {
    if (!proposalPrice || !proposalDate || !proposalMethod || !proposalNote) {
      alert("Vui lòng nhập đầy đủ thông tin !");
      return;
    }

    const numericPrice = proposalPrice.replace(/,/g, "");
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/send-proposal/${negotiationId}/`,
        {
          proposal_price: parseInt(numericPrice, 10),
          proposal_date: proposalDate,
          proposal_method: proposalMethod,
          proposal_note: proposalNote,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        alert("Đề nghị lại thương lượng thành công !");
        window.location.reload();
      } else {
        alert("Bạn đã đề nghị lại trước đó !");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Xem mức đề nghị
  const [isModalViewProposalOpen, setIsModalViewProposalOpen] = useState(false);
  const [
    selectedNegotiationIdViewProposal,
    setSelectedNegotiationIdViewProposal,
  ] = useState(null);
  const [proposalData, setProposalData] = useState(null);

  const openModalViewProposal = async (negotiationId) => {
    if (!negotiationId) {
      alert("Lỗi: ID thương lượng không hợp lệ.");
      return;
    }

    setSelectedNegotiationIdViewProposal(negotiationId);
    setIsModalViewProposalOpen(true);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/negotiation-proposal/${negotiationId}/`,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setProposalData(response.data);
    } catch (error) {
      console.error("Error fetching negotiation proposal:", error);
      alert("Đã xảy ra lỗi khi lấy thông tin đề nghị.");
    }
  };

  const closeModalViewProposal = () => {
    setIsModalViewProposalOpen(false);
    setSelectedNegotiationIdViewProposal(null);
    setProposalData(null);
  };

  // Thương lượng
  const handleNeogotiate = (proposalId) => {
    console.log("Proposal ID:", proposalId);
    if (!sessionToken) {
      alert("Bạn cần đăng nhập để thực hiện hành động này.");
      return;
    } else {
      setProposalID(proposalId);
      console.log("Proposal ID ========= >:", proposalId);
      setIsPopupOpen(true);
    }
  };

  const handleNegoPriceChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9,]/g, "");
    const numericValue = value.replace(/,/g, "");
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    setPrice(formattedValue);
  };

  const handleSubmit = async () => {
    if (!price || !negotiationDate || !paymentMethod || !negotiationNote) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    const numericPrice = price.replace(/,/g, "");

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/accept-proposal/${proposalID}/`,
        {
          is_accepted: true,
          negotiation_price: parseInt(numericPrice, 10),
          negotiation_date: negotiationDate,
          payment_method: paymentMethod,
          negotiation_note: negotiationNote,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Negotiation response:", response.data);
      setIsPopupOpen(false);
      setPrice("");
      setNegotiationDate("");
      setPaymentMethod("");
      setNegotiationNote("");
      alert("Đã gửi yêu cầu thương lượng thành công!");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting negotiation:", error);
      alert(
        "Mức giá thương lượng bạn đưa ra không phù hợp. Vui lòng hãy thử lại với mức giá khác."
      );
    }
  };

  const handleClose = () => {
    setIsPopupOpen(false);
    setPrice("");
    setNegotiationDate("");
    setPaymentMethod("");
    setNegotiationNote("");
  };

  // Sắp xếp và lọc thương lượng
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  // Xem xét thương lượng
  const [isModalConsiderOpen, setIsModalConsiderOpen] = useState(false);
  const [selectedNegotiationIdConsider, setSelectedNegotiationIdConsider] =
    useState(null);

  const openModalConsider = (negotiationId) => {
    setSelectedNegotiationIdConsider(negotiationId);
    setIsModalConsiderOpen(true);
  };

  const closeModalConsider = () => {
    setSelectedNegotiationIdConsider(null);
    setIsModalConsiderOpen(false);
  };

  const handleConsiderNegotiation = async (negotiationId) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/consider-negotiations/`,
        {
          negotiation_id: negotiationId,
          is_considered: true,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Đã xem xét thương lượng thành công !");
        navigate(`/user/chat`);
      } else {
        alert("Đã xảy ra lỗi khi xem xét thương lượng !");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToRoomChat = () => {
    navigate(`/user/chat`);
  };

  return (
    <div className="p-6 mt-[3rem] bg-white border-solid border-gray-300 border-[1px] rounded-lg shadow-lg w-[32rem] max-h-[85rem] overflow-auto">
      <div className="border-b-[2px] border-gray-300 border-solid">
        <h2 className="text-xl font-extrabold text-blue-600 mb-6 text-center flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faHandshake} />
          Danh sách thương lượng
        </h2>
      </div>

      {type === "owner" && (
        <div className="flex flex-col justify-center mb-4 mt-4 gap-2 border-solid border-gray-300 border-b-[2px] pb-3">
          <div className="flex justify-between items-center gap-3">
            <label
              htmlFor="sort_by"
              className="block text-gray-700 font-semibold mb-1 ml-2 text-sm"
            >
              Sắp xếp theo:
            </label>
            <select
              id="sort_by"
              value={sortBy}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-md p-1 text-sm"
            >
              <option value="">Chọn tiêu chí</option>
              <option value="average_response_time">
                Thời gian phản hồi trung bình
              </option>
              <option value="reputation_score">Điểm uy tín</option>
              <option value="successful_transactions">
                Giao dịch thành công
              </option>
              <option value="response_rate">Tỷ lệ phản hồi</option>
              <option value="profile_completeness">Độ hoàn thiện hồ sơ</option>
              <option value="negotiation_experience">
                Kinh nghiệm thương lượng
              </option>
            </select>
          </div>

          <div className="flex justify-between items-center gap-3">
            <label
              htmlFor="order"
              className="block text-gray-700 font-semibold mb-1 ml-2 text-sm"
            >
              Thứ tự:
            </label>
            <select
              id="order"
              value={order}
              onChange={handleOrderChange}
              className="border border-gray-300 rounded-md p-1 text-sm"
            >
              <option value="">Chọn thứ tự</option>
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          </div>

          <div className="flex justify-between items-center gap-3">
            <label
              htmlFor="amount"
              className="block text-gray-700 font-semibold mb-1 ml-2 text-sm"
            >
              Số lượng:
            </label>
            <input
              type="number"
              min={0}
              step={1}
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              className="border border-gray-300 rounded-md p-1 text-sm"
              placeholder="Nhập số lượng"
            />
          </div>
        </div>
      )}

      {negotiations.length > 0 ? (
        <div className="space-y-4 mt-[3rem]">
          {negotiations.map((negotiation) => (
            <div
              key={negotiation.negotiation_id}
              className="bg-blue-50 p-6 border-solid border-gray-300 border-[1px] rounded-lg shadow-lg flex flex-col items-start"
            >
              <div className="w-full flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                  {negotiation.user?.fullname || "Chưa có thông tin"}
                  <span className="text-sm text-gray-500">
                    (@{negotiation.user?.username || "Chưa có thông tin"})
                  </span>
                  {sessionToken && negotiation.user.user_id !== id && (
                    <div className="relative flex items-center ml-9">
                      {/* Icon dấu ba chấm dọc */}
                      <button
                        onClick={toggleMenu}
                        className="focus:outline-none p-3"
                      >
                        <FontAwesomeIcon
                          icon={faEllipsisV}
                          className="text-gray-600 text-xl cursor-pointer opacity-50"
                        />
                      </button>

                      {/* Menu hiện ra khi nhấn vào dấu ba chấm */}
                      {isOpen && role !== "admin" && (
                        <div
                          ref={menuRef}
                          className="absolute right-5 top-8 mt-2 w-[15rem] text-sm font-semibold p-2 bg-white border-solid border-[1px] border-gray-300 rounded-lg shadow-lg flex flex-col space-y-2 z-50"
                        >
                          <button
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md"
                            onClick={() => {
                              handlePersonalProfileClick(
                                negotiation.user.user_id
                              );
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faUser}
                              className="text-blue-500"
                            />
                            <span className="text-gray-700">
                              Thông tin cá nhân
                            </span>
                          </button>

                          <div className="relative">
                            <button
                              className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md"
                              onClick={() => openReportPopup("user")}
                            >
                              <FontAwesomeIcon
                                icon={faFlag}
                                className="text-red-500"
                              />
                              <span className="text-gray-700">
                                Báo cáo người dùng
                              </span>
                            </button>

                            <ReportPopup
                              isOpen={isReportPopupOpen}
                              onClose={closeReportPopup}
                              reportType={reportType}
                              reportedUserId={negotiation.user.user_id}
                              postId={null}
                              commentId={null}
                              reporteeId={id}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </h3>
              </div>

              <p className="text-sm text-gray-600 font-semibold flex items-center gap-2 mt-2">
                <FontAwesomeIcon
                  icon={faDollarSign}
                  className="text-yellow-500"
                />
                Mức giá đề xuất:{" "}
                <span className="text-yellow-600 font-semibold">
                  {parseFloat(
                    negotiation.negotiation_price || 0
                  ).toLocaleString()}{" "}
                  VNĐ
                </span>
              </p>

              <p className="text-sm text-gray-600 font-semibold flex items-center gap-2 mt-2">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-yellow-600"
                />
                Ngày thương lượng:{" "}
                <span className="text-gray-700 font-medium">
                  {new Date(negotiation.created_at).toLocaleString("vi-VN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </p>

              {/* Hình Thức Trả Tiền */}
              <p className="text-sm text-gray-600 font-semibold flex items-center gap-2 mt-2">
                <FontAwesomeIcon
                  icon={faCreditCard}
                  className="text-yellow-600"
                />
                Hình thức trả tiền:{" "}
                <span className="text-gray-700 font-medium">
                  {negotiation.payment_method || "Không xác định"}
                </span>
              </p>

              {/* Ghi Chú Thêm */}
              {negotiation.negotiation_note && (
                <p className="text-sm text-gray-600 font-semibold flex items-start gap-2 mt-2">
                  <FontAwesomeIcon
                    icon={faStickyNote}
                    className="text-yellow-600 mt-1"
                  />
                  Ghi chú:{" "}
                  <span className="text-gray-700 font-medium">
                    {negotiation.negotiation_note}
                  </span>
                </p>
              )}

              <div
                className={`text-sm font-semibold mt-4 flex items-center gap-2 ${
                  negotiation.is_accepted ? "text-green-600" : "text-red-600 "
                }`}
              >
                <FontAwesomeIcon
                  icon={negotiation.is_accepted ? faCheckCircle : faTimesCircle}
                />

                <div
                  className={`p-1 rounded-3xl px-2 ${
                    negotiation.is_accepted ? "bg-green-200" : "bg-red-200"
                  }`}
                >
                  {negotiation.is_accepted ? "Đã chấp nhận" : "Chưa chấp nhận"}
                </div>
              </div>
              {type === "owner" &&
                !negotiation.is_accepted &&
                !negotiation.is_considered && (
                  <div className="flex justify-center items-center gap-3 mt-3 w-full">
                    {/* <button
                    className="text-white bg-gradient-to-r from-blue-500 to-blue-400 px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform duration-200 ease-in-out hover:from-blue-600 hover:to-blue-500"
                    onClick={() => openModal(negotiation.negotiation_id)}
                  >
                    Chấp nhận
                  </button> */}

                    <button
                      className="text-black font-semibold bg-gradient-to-r from-yellow-500 to-yellow-400 px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform duration-200 ease-in-out hover:from-yellow-600 hover:to-yellow-500 "
                      onClick={() =>
                        openModalProposal(negotiation.negotiation_id)
                      }
                    >
                      Đề nghị lại
                    </button>

                    <button
                      className="text-white font-semibold bg-gradient-to-r from-green-600 to-green-500 px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform duration-200 ease-in-out hover:from-green-700 hover:to-green-600 "
                      onClick={() =>
                        openModalConsider(negotiation.negotiation_id)
                      }
                    >
                      Xem xét
                    </button>
                  </div>
                )}
              {type === "owner" &&
                !negotiation.is_accepted &&
                negotiation.is_considered && (
                  <div className="flex justify-center items-center gap-3 mt-3 w-full">
                    <button
                      className="text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-400 px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform duration-200 ease-in-out hover:from-blue-600 hover:to-blue-500 "
                      onClick={() => handleToRoomChat()}
                    >
                      Đang thương lượng
                    </button>
                  </div>
                )}

              {type !== "owner" &&
                negotiation.user.user_id === id &&
                negotiation.proposals.length > 0 && (
                  <div className="flex justify-center items-center gap-3 mt-3 w-full">
                    <button
                      className="text-black font-semibold bg-gradient-to-r from-yellow-500 to-yellow-400 px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform duration-200 ease-in-out hover:from-yellow-600 hover:to-yellow-500 "
                      onClick={() =>
                        openModalViewProposal(negotiation.negotiation_id)
                      }
                    >
                      Xem mức đề nghị
                    </button>
                  </div>
                )}
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
              Bạn có chắc chắn muốn chấp nhận mức thương lượng này?
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

      {isModalProposalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center  border-b-[2px] border-gray-500 border-solid pb-2">
              Đề nghị lại mức thương lượng
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              <strong className="font-bold text-red-500">Chú ý:</strong> Vui
              lòng nhập đầy đủ thông tin để gửi đề nghị lại thương lượng.
            </p>

            {/* Trường Mức Giá Đề Xuất */}
            <div className="mb-4">
              <label
                htmlFor="proposalPrice"
                className="block text-gray-800 font-bold mb-2"
              >
                Mức Giá Đề Xuất (VNĐ)
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="px-3">
                  <FaDollarSign className="text-gray-500" />
                </div>
                <input
                  type="text"
                  id="proposalPrice"
                  value={proposalPrice}
                  onChange={handlePriceChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Nhập mức giá đề xuất (VNĐ)"
                  required
                />
              </div>
            </div>

            {/* Trường Ngày Thương Lượng */}
            <div className="mb-4">
              <label
                htmlFor="proposalDate"
                className="block text-gray-800 font-bold mb-2"
              >
                Ngày Bắt Đầu Giao Dịch
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="px-3">
                  <FaCalendarAlt className="text-gray-500" />
                </div>
                <input
                  type="date"
                  id="proposalDate"
                  value={proposalDate}
                  onChange={(e) => setProposalDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>
            </div>

            {/* Trường Hình Thức Thanh Toán */}
            <div className="mb-4">
              <label
                htmlFor="proposalMethod"
                className="block text-gray-800 font-bold mb-2"
              >
                Hình Thức Thanh Toán
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="px-3">
                  <FaCreditCard className="text-gray-500" />
                </div>
                <select
                  id="proposalMethod"
                  value={proposalMethod}
                  onChange={(e) => setProposalMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                >
                  <option value="" disabled>
                    Chọn hình thức thanh toán
                  </option>
                  <option value="trả góp">Trả góp</option>
                  <option value="trả trước">Trả trước</option>
                  <option value="một lần">Thanh toán một lần</option>
                  <option value="khác">Khác</option>
                </select>
              </div>
            </div>

            {/* Trường Ghi Chú */}
            <div className="mb-6">
              <label
                htmlFor="proposalNote"
                className="block text-gray-800 font-bold mb-2"
              >
                Ghi Chú
              </label>
              <div className="flex items-start border border-gray-300 rounded-lg overflow-hidden">
                <div className="px-3 mt-2">
                  <FaStickyNote className="text-gray-500" />
                </div>
                <textarea
                  id="proposalNote"
                  value={proposalNote}
                  onChange={(e) => setProposalNote(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Ghi chú thêm (tùy chọn)"
                  rows="3"
                ></textarea>
              </div>
            </div>

            {/* Nút Xác Nhận và Hủy Bỏ */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                onClick={() =>
                  handleProposalNegotiation(selectedNegotiationIdProposal)
                }
              >
                Xác nhận
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out"
                onClick={closeModalProposal}
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem Mức Đề Nghị */}
      {isModalViewProposalOpen &&
        proposalData &&
        proposalData.proposals.length > 0 && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full overflow-y-auto max-h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center border-b-[2px] border-gray-500 border-solid pb-2">
                Thông Tin Đề Nghị Lại
              </h2>
              <p className="text-sm text-gray-600 mb-6 text-center">
                Dưới đây là các thông tin đề nghị lại từ người dùng.
              </p>

              {proposalData.proposals.map((proposal) => (
                <div key={proposal.proposal_id} className="mb-6 border-b pb-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-800 font-semibold flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-blue-500"
                      />
                      Người Đề Nghị: {proposal.user.fullname} (@
                      {proposal.user.username})
                    </p>
                  </div>

                  {/* Trường Mức Giá Đề Xuất */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-800 font-semibold flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faDollarSign}
                        className="text-yellow-500"
                      />
                      Mức Giá Đề Xuất:{" "}
                      <span className="text-yellow-600 font-semibold">
                        {parseFloat(proposal.proposal_price).toLocaleString()}{" "}
                        VNĐ
                      </span>
                    </p>
                  </div>

                  {/* Trường Ngày Thương Lượng */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-800 font-semibold flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="text-yellow-600"
                      />
                      Ngày Bắt Đầu Giao Dịch:{" "}
                      <span className="text-gray-700 font-medium">
                        {new Date(proposal.proposal_date).toLocaleDateString(
                          "vi-VN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </p>
                  </div>

                  {/* Trường Hình Thức Thanh Toán */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-800 font-semibold flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faCreditCard}
                        className="text-yellow-600"
                      />
                      Hình Thức Thanh Toán:{" "}
                      <span className="text-gray-700 font-medium">
                        {proposal.proposal_method}
                      </span>
                    </p>
                  </div>

                  {/* Trường Ghi Chú */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-800 font-semibold flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faStickyNote}
                        className="text-yellow-600 mt-1"
                      />
                      Ghi Chú:{" "}
                      <span className="text-gray-700 font-medium">
                        {proposal.proposal_note || "Không có ghi chú."}
                      </span>
                    </p>
                  </div>

                  {/* Trạng Thái Đề Nghị */}
                  <div
                    className={`text-sm font-semibold flex items-center gap-2 ${
                      proposal.is_accepted ? "text-green-600" : "text-red-600 "
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={
                        proposal.is_accepted ? faCheckCircle : faTimesCircle
                      }
                    />

                    <div
                      className={`p-1 rounded-3xl px-2 ${
                        proposal.is_accepted ? "bg-green-200" : "bg-red-200"
                      }`}
                    >
                      {proposal.is_accepted
                        ? "Đang thương lượng"
                        : "Chưa chấp nhận"}
                    </div>
                  </div>

                  {/* Ngày Tạo Đề Nghị */}
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Ngày tạo đề nghị:{" "}
                      <span className="text-gray-700 font-medium">
                        {new Date(proposal.created_at).toLocaleString("vi-VN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </p>
                  </div>

                  {/* Ghi chú cho người dùng */}

                  <div className="mt-5">
                    <p className="text-md font-bold text-red-600">
                      Lưu ý:{" "}
                      <span className="text-gray-700 font-medium">
                        Với mức đề nghị trên từ người đăng bài, nếu bạn muốn gửi
                        một thương lượng mới phù hợp hơn, hãy nhấn{" "}
                        <span className="font-bold text-blue-700">
                          "Gửi lại thương lượng"
                        </span>
                      </span>{" "}
                    </p>
                  </div>
                </div>
              ))}

              {/* Nút Đóng */}
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out"
                  onClick={closeModalViewProposal}
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-300 ease-in-out"
                  onClick={() =>
                    handleNeogotiate(proposalData.proposals[0].proposal_id)
                  }
                >
                  Gửi lại thương lượng
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Thương lượng lại */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center border-b-[2px] border-gray-500 border-solid pb-2">
              Hãy nhập giá tiền và thông tin bạn muốn thương lượng
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              <strong className="font-bold text-red-500">Chú ý:</strong> Khi
              thương lượng, giá thương lượng mà bạn đưa ra không được nhỏ hơn{" "}
              <span className="text-red-500 font-semibold">70%</span> giá tiền
              mà chủ bài viết đã đăng bán.
            </p>

            {/* Trường Giá Thương Lượng */}
            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-gray-800 font-bold mb-2"
              >
                Giá Thương Lượng (VNĐ)
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="px-3">
                  <FaDollarSign className="text-gray-500" />
                </div>
                <input
                  type="text"
                  id="price"
                  value={price}
                  onChange={handleNegoPriceChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Nhập giá tiền (VNĐ)"
                  required
                />
              </div>
            </div>

            {/* Trường Ngày Thương Lượng */}
            <div className="mb-4">
              <label
                htmlFor="negotiationDate"
                className="block text-gray-800 font-bold mb-2"
              >
                Ngày Bắt Đầu Giao Dịch
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="px-3">
                  <FaCalendarAlt className="text-gray-500" />
                </div>
                <input
                  type="date"
                  id="negotiationDate"
                  value={negotiationDate}
                  onChange={(e) => setNegotiationDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>
            </div>

            {/* Trường Hình Thức Trả Tiền */}
            <div className="mb-4">
              <label
                htmlFor="paymentMethod"
                className="block text-gray-800 font-bold mb-2"
              >
                Hình Thức Trả Tiền
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="px-3">
                  <FaCreditCard className="text-gray-500" />
                </div>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                >
                  <option value="" disabled>
                    Chọn hình thức trả tiền
                  </option>
                  <option value="trả góp">Trả góp</option>
                  <option value="một lần">Thanh toán một lần</option>
                  <option value="trả trước">Trả trước</option>
                  <option value="khác">Khác</option>
                  {/* Thêm các lựa chọn khác nếu cần */}
                </select>
              </div>
            </div>

            {/* Trường Ghi Chú Thêm */}
            <div className="mb-6">
              <label
                htmlFor="negotiationNote"
                className="block text-gray-800 font-bold mb-2"
              >
                Ghi Chú Thêm
              </label>
              <div className="flex items-start border border-gray-300 rounded-lg overflow-hidden">
                <div className="px-3 mt-2">
                  <FaStickyNote className="text-gray-500" />
                </div>
                <textarea
                  id="negotiationNote"
                  value={negotiationNote}
                  onChange={(e) => setNegotiationNote(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Ghi chú thêm (tùy chọn)"
                  rows="3"
                ></textarea>
              </div>
            </div>

            {/* Nút Xác Nhận và Hủy Bỏ */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                onClick={handleSubmit}
              >
                Xác nhận
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out"
                onClick={handleClose}
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem Xét Thương Lượng */}
      {isModalConsiderOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center border-b-[2px] border-solid border-gray-600 pb-2">
              Xác nhận xem xét thương lượng
            </h2>
            <p className="text-md font-semibold text-gray-600 mb-6 mt-5 text-center">
              Bạn có chắc chắn muốn xem xét lại thương lượng này?
            </p>

            <p className="text-sm text-gray-600 mb-6 text-center">
              <strong className="font-bold text-red-500">Chú ý:</strong> Nếu
              thấy thương lượng đạt yêu cầu thì bạn có thể cho thương lượng này
              vào danh sách được{" "}
              <span className="text-green-700 font-semibold"> xem xét</span> và
              tạo Chatroom với người được{" "}
              <span className="text-green-700 font-semibold"> xem xét</span> đó.{" "}
            </p>

            {/* Nút Xác Nhận và Hủy Bỏ */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                onClick={() =>
                  handleConsiderNegotiation(selectedNegotiationIdConsider)
                }
              >
                Xác nhận
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out"
                onClick={closeModalConsider}
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
