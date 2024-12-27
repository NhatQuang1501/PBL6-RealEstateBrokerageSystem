import React, { useState, useEffect } from "react";
import Pagination from "../../../components/pagination/pagination";
import { useAppContext } from "../../../AppProvider";
import { useNavigate } from "react-router-dom";

const ManagerUserAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const savedPage = localStorage.getItem("currentPage");
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, []);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(accounts.length / itemsPerPage);
  const indexOfLastAccount = currentPage * itemsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - itemsPerPage;

  const currentAccounts = accounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [lockedAccounts, setLockedAccounts] = useState([]);
  const { sessionToken } = useAppContext();
  const [isLockPopupOpen, setIsLockPopupOpen] = useState(false);
  const [isUnLockPopupOpen, setIsUnLockPopupOpen] = useState(false);

  const [lockedReason, setLockedReason] = useState(
    "Ngôn từ không phù hợp với chính sách của hệ thống"
  );
  const [unlockDate, setUnlockDate] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/auth/users/`);
        const data = await res.json();
        // Filter out accounts with the role "admin"
        const filteredAccounts = data.filter(
          (account) => account.role !== "admin"
        );
        setAccounts(filteredAccounts);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    // Fetch locked accounts
    const fetchLockedAccounts = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/auth/lock-users/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        });
        const data = await res.json();
        setLockedAccounts(data.data.map((item) => item.profile.user_id));
      } catch (err) {
        console.log(err);
      }
    };

    fetchLockedAccounts();
    fetchAccounts();
  }, [sessionToken]);

  if (loading) {
    return (
      <div className="text-center text-lg font-medium">Đang tải dữ liệu...</div>
    );
  }

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handlePersonalProfileClick = (user_id) => {
    navigate(`/user/profile/${user_id}`);
  };

  // Lock account
  const handleLockAccount = async (userId, lockedReason, unlockDate) => {
    const formattedUnlockDate = formatDateTime(unlockDate);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/auth/lock-users/${userId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({
            locked_reason: lockedReason,
            unlocked_date: formattedUnlockDate,
            // locked_reason: "Ngôn từ không phù hợp với chính sách của hệ thống",
            // unlocked_date: "2024-12-09 12:03:00",
          }),
        }
      );
      if (res.ok) {
        console.log("Khóa tài khoản thành công");
        alert("Khóa tài khoản thành công");
        closeLockPopup();
        setLockedAccounts([...lockedAccounts, userId]);
      } else {
        alert("Khóa tài khoản thất bại");
        console.log("Khóa tài khoản thất bại");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Mở popup khóa tài khoản
  const openLockPopup = (userId) => {
    setSelectedUserId(userId);
    setIsLockPopupOpen(true);
  };

  // Đóng popup khóa tài khoản
  const closeLockPopup = () => {
    setIsLockPopupOpen(false);
    setLockedReason("");
    setUnlockDate("");
    setSelectedUserId(null);
  };

  const handleUnlockDateChange = (e) => {
    const selectedDate = e.target.value;
    setUnlockDate(selectedDate);

    const now = new Date();
    const selectedDateTime = new Date(selectedDate);

    if (selectedDateTime <= now) {
      alert(
        "Ngày mở khóa phải là một thời điểm trong tương lai. Vui lòng chọn lại."
      );
      setUnlockDate("");
    }
  };

  // Mở popup mở khóa tài khoản
  const openUnLockPopup = (userId) => {
    setSelectedUserId(userId);
    setIsUnLockPopupOpen(true);
  };

  // Đóng popup mở khóa tài khoản
  const closeUnLockPopup = () => {
    setIsUnLockPopupOpen(false);
    setSelectedUserId(null);
  };

  const handleUnLockAccount = async (userId) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/auth/unlock-users/${userId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      if (res.ok) {
        console.log("Mở khóa tài khoản thành công");
        alert("Mở khóa tài khoản thành công");
        closeUnLockPopup();
        setLockedAccounts(lockedAccounts.filter((id) => id !== userId));
      } else {
        alert("Mở khóa tài khoản thất bại");
        console.log("Mở khóa tài khoản thất bại");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mx-auto p-2 bg-white shadow-md rounded-lg whitespace-nowrap">
      <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800">
        Danh Sách Tài Khoản
      </h2>

      <div className="overflow-x-auto shadow-sm rounded-lg h-[31rem]">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-200 text-gray-800 text-center font-bold ">
              <th className="border border-gray-300 px-4 py-3">STT</th>
              <th className="border border-gray-300 px-4 py-3">Email</th>
              <th className="border border-gray-300 px-4 py-3">Username</th>
              <th className="border border-gray-300 px-4 py-3">Họ Tên</th>
              <th className="border border-gray-300 px-4 py-3">Thành Phố</th>
              <th className="border border-gray-300 px-4 py-3">Ngày Sinh</th>
              <th className="border border-gray-300 px-4 py-3">
                Số Điện Thoại
              </th>
              <th className="border border-gray-300 px-4 py-3">Giới Tính</th>
              <th className="border border-gray-300 px-4 py-3">Ảnh Đại Diện</th>
              <th className="border border-gray-300 px-4 py-3">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {currentAccounts.map((account, index) => {
              const user = account.user || {};
              return (
                <tr
                  key={account.user_id}
                  className="hover:bg-blue-50 text-center font-semibold text-gray-500"
                >
                  <td className="border border-gray-300 px-4 py-3 whitespace-nowrap font-bold">
                    {indexOfFirstAccount + index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 whitespace-nowrap">
                    <span
                      className={
                        !user.email || user.email === "Chưa có thông tin"
                          ? "italic font-light"
                          : ""
                      }
                    >
                      {user.email || "Chưa có thông tin"}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 whitespace-nowrap">
                    <span
                      className={
                        !user.username || user.username === "Chưa có thông tin"
                          ? "italic font-light"
                          : ""
                      }
                    >
                      {user.username || "Chưa có thông tin"}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 whitespace-nowrap">
                    <span
                      className={
                        !account.fullname ||
                        account.fullname === "Chưa có thông tin"
                          ? "italic font-light"
                          : ""
                      }
                    >
                      {account.fullname || "Chưa có thông tin"}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 whitespace-nowrap">
                    <span
                      className={
                        !account.city || account.city === "Chưa có thông tin"
                          ? "italic font-light"
                          : ""
                      }
                    >
                      {account.city || "Chưa có thông tin"}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 whitespace-nowrap">
                    <span
                      className={
                        !account.birthdate ||
                        account.birthdate === "Chưa có thông tin"
                          ? "italic font-light"
                          : ""
                      }
                    >
                      {account.birthdate || "Chưa có thông tin"}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 whitespace-nowrap">
                    <span
                      className={
                        !account.phone_number ||
                        account.phone_number === "Chưa có thông tin"
                          ? "italic font-light"
                          : ""
                      }
                    >
                      {account.phone_number || "Chưa có thông tin"}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 whitespace-nowrap">
                    <span
                      className={
                        !account.gender ||
                        account.gender === "Chưa có thông tin"
                          ? "italic font-light"
                          : ""
                      }
                    >
                      {account.gender || "Chưa có thông tin"}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 whitespace-nowrap">
                    {account.avatar ? (
                      <img
                        src={`${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}${account.avatar}`}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full mx-auto object-cover"
                      />
                    ) : (
                      <span className="italic font-light">
                        Chưa có thông tin
                      </span>
                    )}
                  </td>

                  <td className="border border-gray-300 px-4 py-3 space-x-2  whitespace-nowrap font-bold">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                      onClick={() => {
                        handlePersonalProfileClick(account.user_id);
                      }}
                    >
                      Trang cá nhân
                    </button>
                    {/* <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                      Khóa tài khoản
                    </button>
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">
                      Mở khóa tài khoản
                    </button> */}
                    {/* <span>{lockedAccounts}</span> */}
                    {lockedAccounts.includes(account.user_id) ? (
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                        onClick={() => openUnLockPopup(account.user_id)}
                      >
                        Mở khóa tài khoản
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 ml-2"
                        onClick={() => openLockPopup(account.user_id)}
                      >
                        Khóa tài khoản
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Popup khóa tài khoản */}
      {isLockPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl mx-4">
            <h2 className="text-2xl font-bold mb-6 text-center border-b-[2px] border-solid border-gray-500">
              Khóa tài khoản
            </h2>
            <div className="mb-6">
              <label className="block text-gray-700 mb-3 font-bold">
                Lý do khóa tài khoản:
              </label>
              {/* Thẻ lý do */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  "Ngôn từ không phù hợp",
                  "Spam nội dung",
                  "Hành vi gian lận",
                  "Vi phạm điều khoản",
                  "Khác",
                ].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    className={`px-3 py-1 rounded-full border ${
                      lockedReason === reason
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-200 text-gray-700 border-gray-300"
                    }`}
                    onClick={() => setLockedReason(reason)}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              {/* Ô nhập lý do */}
              <textarea
                value={lockedReason}
                onChange={(e) => setLockedReason(e.target.value)}
                className="w-full mt-1 p-3 border rounded resize-none"
                rows="4"
                placeholder="Nhập lý do khóa tài khoản"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-bold">
                Ngày mở khóa:
              </label>
              <input
                type="datetime-local"
                value={unlockDate}
                onChange={handleUnlockDateChange}
                className="w-full mt-1 p-2 border rounded"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400 font-semibold"
                onClick={closeLockPopup}
              >
                Hủy
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-semibold"
                onClick={() =>
                  handleLockAccount(selectedUserId, lockedReason, unlockDate)
                }
              >
                Khóa tài khoản
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup mở khóa tài khoản */}
      {isUnLockPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-6 text-center border-b-[2px] border-solid border-gray-500">
              Mở khóa tài khoản
            </h2>
            <p className="mb-6 text-center font-semibold">
              Bạn có chắc chắn muốn mở khóa tài khoản này không?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400 font-semibold"
                onClick={closeLockPopup}
              >
                Hủy
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-semibold"
                onClick={() => handleUnLockAccount(selectedUserId)}
              >
                Mở khóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {accounts.length > 0 ? (
        <div className="">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <div className="text-center font-bold">Không có tài khoản nào</div>
      )}
    </div>
  );
};

export default ManagerUserAccount;
