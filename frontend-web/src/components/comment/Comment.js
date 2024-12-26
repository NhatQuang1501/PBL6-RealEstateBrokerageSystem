import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaComment,
  FaFlag,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";
import { useAppContext } from "../../AppProvider";
import ReportPopup from "../report/ReportPopup ";
import User from "../../assets/image/User.png";

const Comment = ({ post_id, sessionToken, reportedCmtId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const { role, id } = useAppContext();
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [isReportPopupOpen, setReportPopupOpen] = useState(false);
  const [selectedUserCommentId, setSelectedUserCommentId] = useState(null);
  const [confirmDeletePopupOpen, setConfirmDeletePopupOpen] = useState(false);

  const sortedComments = [...comments].sort((a, b) => {
    if (role === "admin" && a.comment_id === reportedCmtId) return -1;
    if (role === "admin" && b.comment_id === reportedCmtId) return 1;
    return 0;
  });

  // Time
  const formatTime = (date) => {
    const postDate = new Date(date);
    const currentDate = new Date();
    const timeDifference = currentDate - postDate; // Thời gian chênh lệch tính bằng milliseconds

    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let timeDisplay = "";
    if (days < 3) {
      if (days >= 2) {
        timeDisplay = `${days} ngày trước vào lúc ${postDate.toLocaleTimeString(
          "vi-VN",
          { hour: "2-digit", minute: "2-digit" }
        )}`;
      } else if (days === 1) {
        timeDisplay = `Hôm qua vào lúc ${postDate.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      } else if (hours >= 1) {
        timeDisplay = `${hours} giờ trước`;
      } else if (minutes >= 1) {
        timeDisplay = `${minutes} phút trước`;
      } else {
        timeDisplay = "Vừa mới đăng";
      }
    } else {
      timeDisplay = `${postDate.toLocaleDateString(
        "vi-VN"
      )} vào lúc ${postDate.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return timeDisplay;
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/posts/${post_id}/comments/`
        );
        const data = await response.json();

        // Sử dụng Promise.all để đợi tất cả các yêu cầu get avatar hoàn thành
        const commentsWithAvatar = await Promise.all(
          data.map(async (item) => {
            try {
              const avatarResponse = await axios.get(
                `http://127.0.0.1:8000/auth/users-avatar/${item.user_id}/`,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              return {
                ...item,
                avatar_url:
                  avatarResponse.data.avatar_url ??
                  "https://th.bing.com/th/id/OIP.Kt4xItiSOKueszQh9UysdgAAAA?w=465&h=465&rs=1&pid=ImgDetMain",
              };
            } catch (error) {
              console.error("Error fetching avatar:", error);
              return {
                ...item,
                avatar_url:
                  "https://th.bing.com/th/id/OIP.Kt4xItiSOKueszQh9UysdgAAAA?w=465&h=465&rs=1&pid=ImgDetMain",
              };
            }
          })
        );

        setComments(commentsWithAvatar);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [post_id]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    if (!sessionToken) {
      alert("Bạn cần đăng nhập để thực hiện hành động này.");
      return;
    } else {
      e.preventDefault();
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/posts/${post_id}/comments/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ comment }),
          }
        );

        if (response.ok) {
          console.log("Comment posted successfully");
          setComment("");
          window.location.reload();
        } else {
          console.error("Failed to post comment");
        }
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    }
  };

  //User report comment
  const handleReport = (commentId, userID) => {
    console.log(`Báo cáo bình luận với ID: ${commentId}`);
    setSelectedCommentId(commentId);
    setSelectedUserCommentId(userID);
    setReportPopupOpen(true);
  };

  //Admin delete comment
  const handleDeleteComment = (commentId) => {
    setSelectedCommentId(commentId);
    setConfirmDeletePopupOpen(true);
  };

  const closeConfirmDeletePopup = () => {
    setSelectedCommentId(null);
    setConfirmDeletePopupOpen(false);
  };

  const confirmDelete = () => {
    handleDelete(selectedCommentId);
    console.log("Xóa bình luận với ID:", selectedCommentId);
    closeConfirmDeletePopup();
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/auth/report-comment/${commentId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Comment deleted successfully");
        alert("Bình luận đã bị xóa.");
        window.location.reload();
      } else {
        alert("Xóa bình luận thất bại !");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="flex flex-col justify-start items-center max-h-screen mr-5">
      <div className="flex flex-col items-center justify-between p-6 mt-5 mb-5 mr-5 min-h-[20rem] h-full w-[32rem] mx-auto rounded-lg bg-white border-solid border-gray-300 border-[1px] shadow-md">
        <div className="flex items-center justify-center w-full mb-4 gap-3 border-b-[2px] border-gray-300 border-solid pb-5">
          <FaComment className="text-xl text-gray-600" />
          <h1 className="text-xl font-bold text-gray-600">Bình luận</h1>
        </div>

        {/* List of Comments */}
        <ul className="w-full flex flex-col items-start overflow-y-auto mt-4 ">
          {sortedComments.map((comment) => (
            <li
              key={comment.comment_id}
              className="flex flex-col items-start mb-4 bg-gray-100 p-3 rounded-2xl w-full"
            >
              <div className="flex items-center w-full">
                <img
                  src={comment.avatar_url ? comment.avatar_url : User}
                  alt={comment.username}
                  className="w-12 h-12 rounded-full mr-3 object-cover border-gray-100 border-solid border-[1px] bg-gray-500"
                />
                <span className="font-semibold">{comment.username}</span>
                <span className="text-gray-500 text-sm ml-2">
                  {formatTime(comment.created_at)}
                </span>

                {comment.user_id !== id &&
                  role !== "admin" &&
                  !comment.is_report_removed && (
                    <button
                      className="ml-auto text-gray-500 hover:text-red-500 transition"
                      onClick={() =>
                        handleReport(comment.comment_id, comment.user_id)
                      }
                      title="Báo cáo bình luận"
                    >
                      <FaFlag className="w-6 h-6" />
                    </button>
                  )}
                {role === "admin" &&
                  comment.comment_id === reportedCmtId &&
                  !comment.is_report_removed && (
                    <span
                      className="ml-auto text-red-500 cursor-pointer hover:text-red-600 hover:scale-105 transition"
                      onClick={() => handleDeleteComment(comment.comment_id)}
                      title="Bình luận bị báo cáo"
                    >
                      <FaFlag className="w-6 h-6" />
                    </span>
                  )}
                {role === "admin" && !comment.is_report_removed && (
                  <span
                    className="ml-auto text-red-500 cursor-pointer hover:text-red-600 hover:scale-105 transition"
                    onClick={() => handleDeleteComment(comment.comment_id)}
                    title="Xóa bình luận"
                  >
                    <FaTimesCircle className="w-6 h-6" />
                  </span>
                )}
              </div>
              {!comment.is_report_removed ? (
                <p className="ml-20 text-gray-700 bg-blue-200 p-3 rounded-md max-w-[20rem] break-words font-semibold text-sm">
                  {comment.comment}
                </p>
              ) : (
                <div className="ml-20 text-gray-700 bg-red-100 p-3 rounded-md max-w-[23rem] break-words border-[1px] border-red-500 border-solid">
                  <div className="flex items-center">
                    <FaExclamationTriangle className="text-red-500 mr-2 w-7 h-7 " />
                    <p className="font-semibold">
                      Bình luận này đã bị xóa vì vi phạm quy định của SWEETHOME.
                    </p>
                  </div>
                </div>
              )}
            </li>
          ))}

          {isReportPopupOpen && (
            <ReportPopup
              isOpen={isReportPopupOpen}
              onClose={() => setReportPopupOpen(false)}
              reportType="comment"
              commentId={selectedCommentId}
              postId={post_id}
              reportedUserId={selectedUserCommentId}
              reporteeId={id}
            />
          )}
          {confirmDeletePopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                  Xác nhận xóa bình luận
                </h2>
                <p className="mb-4">
                  Bạn có chắc chắn muốn xóa bình luận này không?
                </p>
                <div className="flex justify-end">
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                    onClick={closeConfirmDeletePopup}
                  >
                    Hủy
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={confirmDelete}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          )}
        </ul>
        {comments.length === 0 && (
          <p className="text-gray-500 text-center italic font-semibold w-full mb-[6rem]">
            Chưa có bình luận nào.
          </p>
        )}

        {role !== "admin" && (
          <>
            {/* Comment Input */}
            <div className="flex flex-col items-center justify-center w-full">
              <textarea
                name="comment"
                id="comment"
                cols="30"
                rows="10"
                className="w-[25rem] h-[5rem] border-[2px] border-double border-gray-400 rounded-[0.5rem] p-2 mt-4"
                placeholder="Hãy nhập bình luận của bạn..."
                value={comment}
                onChange={handleCommentChange}
              ></textarea>
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform duration-200 ease-in-out hover:from-blue-600 hover:to-blue-500 mt-3"
                onClick={handleCommentSubmit}
              >
                Bình luận
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
