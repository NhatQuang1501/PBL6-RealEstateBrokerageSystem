import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCheckCircle,
  faArrowRight,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useAppContext } from "../../AppProvider";
import { useNavigate } from "react-router-dom";
import User from "../../assets/image/User.png";

const NotifyUser = () => {
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { id } = useAppContext();
  const [ws, setWs] = useState(null);
  let navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [typeNotify, setTypeNotify] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket(
      `ws://127.0.0.1:8000/ws/notifications/?user_id=${id}`
    );

    websocket.onopen = () => {
      console.log("WebSocket connection established");
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.type === "all_notifications") {
        setTypeNotify("all");
        const unreadNotifications = response.notifications.filter(
          (notification) => !notification.is_read
        );
        setNotifications(unreadNotifications);
      } else if (response.type === "new_notification") {
        setTypeNotify("new");
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          response.notification,
        ]);
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      websocket.close();
    };
  }, [id]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleMarkAsRead = (notificationId) => {
    if (ws) {
      const message = {
        action: "mark_as_read",
        notifications_id: [notificationId],
      };
      ws.send(JSON.stringify(message));
    }

    setNotifications((prev) =>
      prev.map((notification) =>
        notification.notification_id === notificationId
          ? { ...notification, is_read: true }
          : notification
      )
    );
  };

  // const handleGoToReport = (reportId) => {
  //   navigate(`/admin/manage-report/${reportId}`);
  //   setIsDropdownOpen(false);
  // };

  const handleGoToPost = (postId) => {
    navigate(`/user/detail-post/${postId}`);
    setIsDropdownOpen(false);
  };

  let unreadCount = 0;
  if (typeNotify === "all") {
    unreadCount = notifications.filter(
      (notification) => !notification.is_read
    ).length;
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative p-2 pr-[2rem] rounded-full text-black transition duration-300"
      >
        <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0  inline-flex items-center justify-center h-5 w-5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-[30rem] bg-white rounded-xl shadow-lg z-10 border-[1px] border-gray-400 border-solid"
        >
          <div className="p-4">
            <ul className="mt-2 max-h-64 overflow-y-auto bg-white rounded-lg">
              {notifications.slice().map((notification) => (
                <li
                  key={notification.notification_id}
                  className={`p-3 border-b-[2px] border-solid border-gray-300 flex items-start ${
                    notification.is_read ? "bg-gray-300" : "bg-gray-100"
                  } hover:bg-blue-100 transition duration-300`}
                >
                  {["adminpost", "post", "proposal"].includes(
                    notification.data.additional_info.type
                  ) && (
                    <img
                      src={`http://127.0.0.1:8000${notification.data.additional_info.author_avatar}`}
                      alt="Avatar"
                      className="h-12 w-12 rounded-full mr-3 object-cover border-[1px] border-gray-400 border-solid"
                    />
                  )}
                  {["negotiation"].includes(
                    notification.data.additional_info.type
                  ) && (
                    <img
                      src={`http://127.0.0.1:8000${notification.data.additional_info.negotiator_avatar}`}
                      alt="Avatar"
                      className="h-12 w-12 rounded-full mr-3 object-cover border-[1px] border-gray-400 border-solid"
                    />
                  )}
                  {["deleteadminpost"].includes(
                    notification.data.additional_info.type
                  ) && (
                    <img
                      src={User}
                      alt="Avatar"
                      className="h-12 w-12 rounded-full mr-3 object-cover border-[1px] border-gray-400 border-solid"
                    />
                  )}
                  <div className="flex-1">
                    {!notification.data.additional_info ? (
                      <>
                        <p className="text-md font-semibold text-blue-800">
                          <span className="text-gray-500">
                            {notification.description}
                          </span>{" "}
                        </p>
                        <p className="flex items-center justify-end text-xs text-gray-500 mb-1">
                          <FontAwesomeIcon icon={faClock} className="mr-1" />
                          {notification.data.created_at}
                        </p>
                        <div className="flex justify-end mt-2">
                          {!notification.is_read && (
                            <button
                              onClick={() =>
                                handleMarkAsRead(notification.notification_id)
                              }
                              className="text-sm text-green-500 hover:text-green-600 flex items-center"
                            >
                              <FontAwesomeIcon
                                icon={faCheckCircle}
                                className="mr-1"
                              />
                              Đánh dấu đã xem
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-md font-semibold text-blue-800">
                          <span className="text-gray-500">
                            {notification.description}
                          </span>{" "}
                        </p>
                        <p className="flex items-center justify-end text-xs text-gray-500 mb-1">
                          <FontAwesomeIcon icon={faClock} className="mr-1" />
                          {notification.data.created_at}
                        </p>
                        <div className="flex justify-between mt-2">
                          {["adminpost", "post", "proposal", "negotiation"].includes(
                            notification.data.additional_info.type
                          ) && (
                            <button
                              onClick={() =>
                                handleGoToPost(
                                  notification.data.additional_info.post_id
                                )
                              }
                              className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
                            >
                              <FontAwesomeIcon
                                icon={faArrowRight}
                                className="mr-1"
                              />
                              Đi đến bài viết
                            </button>
                          )}
                          {!notification.is_read && (
                            <button
                              onClick={() =>
                                handleMarkAsRead(notification.notification_id)
                              }
                              className="text-sm text-green-500 hover:text-green-600 flex items-center"
                            >
                              <FontAwesomeIcon
                                icon={faCheckCircle}
                                className="mr-1"
                              />
                              Đánh dấu đã xem
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotifyUser;
