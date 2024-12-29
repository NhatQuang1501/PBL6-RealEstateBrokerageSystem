import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../AppProvider";
import { useNavigate } from "react-router-dom";
import User from "../../../assets/image/User.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { sessionToken } = useAppContext();
  let navigate = useNavigate();

  // Manage expanded state for each report
  const [expandedReportIds, setExpandedReportIds] = useState([]);

  // Toggle expand for a specific report
  const toggleExpand = (reportId) => {
    setExpandedReportIds((prev) =>
      prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId]
    );
  };

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/api/report/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              "Content-Type": "application/json",
            },
          }
        );
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

  const handleResolveReport = async (reportId) => {
    console.log("Resolving report with ID:", reportId);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/api/report/${reportId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const updatedReports = reports.map((report) =>
          report.report_id === reportId ? { ...report, resolved: true } : report
        );
        setReports(updatedReports);
        alert("Đã giải quyết báo cáo thành công.");
      }
      setLoading(false);
    } catch (error) {
      setError("Có lỗi xảy ra khi tải dữ liệu.");
      setLoading(false);
    }
  };

  const handleViewPost = (postId, commentId) => {
    window.location.href = `/admin/detail-post/${postId}?comment_id=${commentId}`;
  };

  const handlePersonalProfileClick = (user_id) => {
    navigate(`/user/profile/${user_id}`);
  };

  const handleDetailReportClick = (reportId) => {
    navigate(`/admin/detail-report/${reportId}`);
  };

  // Render loading or error state
  if (loading)
    return <div className="text-center text-xl font-bold">Đang tải...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-2">
      <div className="flex justify-center items-center">
        <h1 className="text-xl text-center font-bold mb-4 w-auto bg-white px-5 py-1 rounded-3xl shadow-md underline flex items-center border-[1px] border-solid border-gray-400">
          <FontAwesomeIcon icon={faListAlt} className="text-xl text-black mr-2" />
          Danh Sách Báo Cáo
        </h1>
      </div>
      {reports.length === 0 ? (
        <p>Không có báo cáo nào.</p>
      ) : (
        <div className="h-[35rem] overflow-auto">
          {reports.map((report) => {
            const isExpanded = expandedReportIds.includes(report.report_id);
            return (
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
                        // src={`${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}${report.reportee_avt}`}
                        src={
                          report.reportee_avt
                            ? `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}${report.reportee_avt}`
                            : User
                        }
                        alt={report.reportee_name}
                        className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-blue-400"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {report.reportee_name}
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
                        // src={`${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}${report.reported_user_avt}`}
                        src={
                          report.reported_user_avt
                            ? `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}${report.reported_user_avt}`
                            : User
                        }
                        alt={report.reported_user_name}
                        className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-red-400"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {report.reported_user_name}
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
                    onClick={() => toggleExpand(report.report_id)}
                    className="text-blue-500 hover:underline mt-2 focus:outline-none"
                  >
                    {isExpanded ? "Thu gọn" : "Xem thêm"}
                  </button>
                </div>

                {/* Thời gian tạo báo cáo và trạng thái */}
                <div className="flex justify-between gap-5 items-center text-sm text-gray-500">
                  <span>{new Date(report.created_at).toLocaleString()}</span>
                  <div className="flex gap-10">
                    {report.report_type === "Bài đăng" ||
                    report.report_type === "Bình luận" ? (
                      <button
                        className="px-4 py-2 rounded-full text-white bg-blue-500 font-semibold"
                        onClick={() =>
                          handleViewPost(report.post_id, report.comment_id)
                        }
                      >
                        Đến bài đăng
                      </button>
                    ) : (
                      <button
                        className="px-4 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 font-semibold"
                        onClick={() => {
                          handlePersonalProfileClick(report.reported_user_id);
                        }}
                      >
                        Xem thông tin người dùng
                      </button>
                    )}
                    <button
                      className="px-4 py-2 rounded-full text-white bg-gray-500 hover:bg-gray-600 font-semibold"
                      onClick={() => {
                        handleDetailReportClick(report.report_id);
                      }}
                    >
                      Chi tiết báo cáo
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full font-semibold text-white ${
                        report.resolved
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                      onClick={() => {
                        handleResolveReport(report.report_id);
                      }}
                    >
                      {report.resolved ? "Đã giải quyết" : "Giải quyết ?"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReportList;
