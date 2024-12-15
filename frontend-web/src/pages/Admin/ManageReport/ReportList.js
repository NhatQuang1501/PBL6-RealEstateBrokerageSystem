import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../AppProvider";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { sessionToken } = useAppContext();

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Gọi API để lấy danh sách báo cáo
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/report/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setReports(data);
        setLoading(false);
      } catch (error) {
        setError("Có lỗi xảy ra khi tải dữ liệu.");
        setLoading(false);
      }
    };

    fetchReports();
  }, [sessionToken]);

  const handleViewPost = (postId, commentId) => {
    window.location.href = `/admin/detail-post/${postId}?comment_id=${commentId}`;
  };

  // Hiển thị dữ liệu khi đang tải hoặc khi có lỗi
  if (loading) return <div className="text-center text-xl">Đang tải...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-2">
      <h1 className="text-3xl font-bold mb-6">Danh Sách Báo Cáo</h1>
      {reports.length === 0 ? (
        <p>Không có báo cáo nào.</p>
      ) : (
        <div className="h-[35rem] overflow-auto">
          {reports.map((report) => (
            <div
              key={report.report_id}
              className="bg-white shadow-md rounded-lg mb-6 p-6"
            >
              <div className="flex justify-between space-x-6">
                {/* Thông tin người báo cáo */}
                <div className="flex flex-col mb-4 w-1/2">
                  <label className="text-lg font-semibold mb-2 text-blue-500">
                    Người Báo Cáo
                  </label>
                  <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
                    <img
                      src={`http://127.0.0.1:8000${report.reported_user_avt}`}
                      alt={report.reported_user_name}
                      className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-blue-400"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {report.reported_user_name}
                      </h3>
                      <div className="flex flex-row justify-start items-center gap-3">
                        <p className="text-sm text-gray-500">Loại báo cáo:</p>
                        <p className="font-semibold text-blue-400">
                          {report.report_type}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thông tin người bị báo cáo */}
                <div className="flex flex-col mb-4 w-1/2">
                  <label className="text-lg font-semibold mb-2 text-gray-700">
                    Người Bị Báo Cáo
                  </label>
                  <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
                    <img
                      src={`http://127.0.0.1:8000${report.reportee_avt}`}
                      alt={report.reportee_name}
                      className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-red-400"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {report.reportee_name}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mô tả báo cáo */}
              <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                <p className="text-md text-red-500 font-semibold mb-2">
                  Mô tả báo cáo:
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: isExpanded
                      ? report.description
                      : `${report.description.substring(0, 100)}...`,
                  }}
                  className="text-sm text-gray-700"
                ></p>
                <button
                  onClick={toggleExpand}
                  className="text-blue-500 hover:underline mt-2 focus:outline-none"
                >
                  {isExpanded ? "Thu gọn" : "Xem thêm"}
                </button>
              </div>

              {/* Thời gian tạo báo cáo và trạng thái */}
              <div className="flex justify-start gap-5 items-center text-sm text-gray-500">
                <span>{new Date(report.created_at).toLocaleString()}</span>
                {report.report_type === "Bài đăng" ||
                report.report_type === "Bình luận" ? (
                  <button
                    className="px-4 py-2 rounded-full text-white bg-blue-500"
                    onClick={() => handleViewPost(report.post_id, report.comment_id)}
                  >
                    Đến bài đăng
                  </button>
                ) : (
                  <button className="px-4 py-2 rounded-full text-white bg-blue-500">
                    Xem thông tin người dùng
                  </button>
                )}
                <button
                  className={`px-4 py-2 rounded-full text-white ${
                    report.resolved ? "bg-green-500" : "bg-yellow-500"
                  }`}
                >
                  {report.resolved ? "Đã giải quyết" : "Chưa giải quyết"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportList;
