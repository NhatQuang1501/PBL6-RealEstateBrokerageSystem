import { useEffect, useState } from "react";
import Portfolio from "../../components/personal_profile/Portfolio";
import ProfileCard from "../../components/personal_profile/ProfileCard";
import { useAppContext } from "../../AppProvider";
import Logo from "../../assets/image/Logo.png";
import { useNavigate } from "react-router-dom";

const PersonalProfile = () => {
  const { role, sessionToken } = useAppContext();
  let navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isLockPopupOpen, setIsLockPopupOpen] = useState(false);
  const [isUnLockPopupOpen, setIsUnLockPopupOpen] = useState(false);
  const [lockedReason, setLockedReason] = useState(
    "Ngôn từ không phù hợp với chính sách của hệ thống"
  );
  const [unlockDate, setUnlockDate] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [lockedAccounts, setLockedAccounts] = useState([]);

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

  // Lock account
  const handleLockAccount = async (userId, lockedReason, unlockDate) => {
    const formattedUnlockDate = formatDateTime(unlockDate);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/auth/lock-users/${userId}/`,
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
        window.location.reload();
      } else {
        alert("Khóa tài khoản thất bại");
        console.log("Khóa tài khoản thất bại");
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Mở popup khóa tài khoản
  const openLockPopup_ = (userId) => {
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
  const openUnLockPopup_ = (userId) => {
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
        `http://127.0.0.1:8000/auth/unlock-users/${userId}/`,
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
        window.location.reload();
      } else {
        alert("Mở khóa tài khoản thất bại");
        console.log("Mở khóa tài khoản thất bại");
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen text-white p-3 font-montserrat">
      <div className="grid grid-cols-8 gap-1">
        {role === "user" ? (
          <div className="col-span-2 sticky top-[6rem] self-start">
            <ProfileCard />
          </div>
        ) : (
          <div className="col-span-2 sticky top-[1rem] self-start">
            <div className="flex flex-col gap-[3rem] cursor-pointer">
              <div
                className="flex items-center w-auto gap-3"
                onClick={() => navigate("/admin/dashboard")}
              >
                <img
                  className="h-13 w-13 object-contain"
                  src={Logo}
                  alt="Logo"
                />
                <strong className="flex flex-col justify-between h-8 text-black">
                  <p className="font-bold">Admin</p>
                  <p className="font-bold">SweetHome</p>
                </strong>
              </div>
              <ProfileCard
                openLockPopup_={openLockPopup_}
                openUnLockPopup_={openUnLockPopup_}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="col-span-6">
          {/* Portfolio */}
          <div className="flex-1">
            <Portfolio />
          </div>

          {/* Popup khóa tài khoản */}
          {isLockPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl mx-4 text-black">
                <h2 className="text-2xl text-black font-bold mb-6 text-center border-b-[2px] border-solid border-gray-500">
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
                      handleLockAccount(
                        selectedUserId,
                        lockedReason,
                        unlockDate
                      )
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
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 text-black">
                <h2 className="text-2xl font-bold mb-6 text-center border-b-[2px] border-solid border-gray-500">
                  Mở khóa tài khoản
                </h2>
                <p className="mb-6 text-center font-semibold">
                  Bạn có chắc chắn muốn mở khóa tài khoản này không?
                </p>
                <div className="flex justify-end">
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400 font-semibold"
                    onClick={closeUnLockPopup}
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
        </div>
      </div>
    </div>
  );
};

export default PersonalProfile;
