import { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAppContext } from "../../AppProvider";

const ReportPopup = ({
  isOpen,
  onClose,
  reportType,
  reportedUserId,
  postId,
  commentId,
  reporteeId,
}) => {
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");
  const { sessionToken } = useAppContext();

  const reasons = [
    "Lừa đảo",
    "Spam",
    "Mạo danh",
    "Nội dung bạo lực",
    "Nội dung tục tĩu",
    "Vi phạm bản quyền",
    "Quấy rối",
    "Phân biệt đối xử",
    "Khác",
  ];

  const handleReportSubmit = async () => {
    if (!reason) {
      alert("Vui lòng chọn lý do báo cáo.");
      return;
    }

    const fullDescription = `<strong>Lý do:</strong> ${reason}<br><br>${description}`;

    const reportData = {
      post_id: postId || "",
      comment_id: commentId || "",
      reported_user_id: reportedUserId,
      reportee_id: reporteeId,
      description: fullDescription,
      report_type: reportType,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/report/",
        reportData,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if(response.status === 201) {
      console.log("Report submitted successfully:", response.data);
      alert("Báo cáo đã được gửi thành công!");
      onClose();
      }
      else if(response.status === 400) {
        alert("Báo cáo đã được gửi trước đó!");
        onClose();
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Báo cáo đã được gửi trước đó!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[80rem] max-w-[70rem] space-y-6 relative overflow-y-auto max-h-[100vh] text-black">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center border-solid border-gray-500 border-b-[2px] pb-5">
          Báo cáo{" "}
          {reportType === "user"
            ? "người dùng"
            : reportType === "post"
            ? "bài đăng"
            : "bình luận"}
        </h2>

        {/* Lý do báo cáo */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2 text-lg">
            Chọn lý do báo cáo:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {reasons.map((item, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  reason === item
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }`}
                onClick={() => setReason(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Mô tả chi tiết */}
        <div className="mb-4 flex-grow">
          <label className="block text-gray-700 font-semibold mb-2 text-lg">
            Mô tả chi tiết:
          </label>
          <div className="h-[300px]">
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              placeholder="Nhập mô tả báo cáo chi tiết tại đây..."
              className="h-[230px]"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            className="bg-gray-300 text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-400 transition-all"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="bg-red-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-red-700 transition-all"
            onClick={handleReportSubmit}
          >
            Gửi báo cáo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPopup;
