import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../AppProvider";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../../../assets/image/Logo.png";

const ReportDetail = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { sessionToken } = useAppContext();
  let navigate = useNavigate();
  const { reportId } = useParams();

  // Fetch report detail from API
  useEffect(() => {
    const fetchReportDetail = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/report/${reportId}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setReport(data);
        setLoading(false);
      } catch (error) {
        setError("Có lỗi xảy ra khi tải dữ liệu.");
        setLoading(false);
      }
    };
    fetchReportDetail();
  }, [sessionToken, reportId]);

  const handleViewPost = (postId, commentId) => {
    window.location.href = `/admin/detail-post/${postId}?comment_id=${commentId}`;
  };

  const handlePersonalProfileClick = (user_id) => {
    navigate(`/user/profile/${user_id}`);
  };

  const handleResolveReport = async (reportId) => {
    console.log("Resolving report with ID:", reportId);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/report/${reportId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        alert("Đã giải quyết báo cáo thành công.");
        window.history.back();
      }
      setLoading(false);
    } catch (error) {
      setError("Có lỗi xảy ra khi tải dữ liệu.");
      setLoading(false);
    }
  };

  // Render loading or error state
  if (loading) return <div className="text-center text-xl">Đang tải...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 font-montserrat min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="relative flex items-center justify-center">
        {/* Logo Section */}
        <div
          className="absolute left-0 flex items-center w-auto gap-3 cursor-pointer"
          onClick={() => navigate("/admin/dashboard")}
        >
          <img className="h-13 w-13 object-contain" src={Logo} alt="Logo" />
          <strong className="flex flex-col justify-between h-8 text-black">
            <p className="font-bold">Admin</p>
            <p className="font-bold">SweetHome</p>
          </strong>
        </div>

        {/* Title Section */}
        <div className="flex items-center justify-center mt-[1rem]">
          <h1 className="text-3xl font-extrabold text-black text-center border-b-4 border-gray-500 border-solid">
            CHI TIẾT BÁO CÁO
          </h1>
        </div>
      </div>

      {!report ? (
        <div className="text-center text-gray-500 mt-[20rem]">
          Không có báo cáo nào.
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl p-6 mt-[3rem]">
          {/* Report Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Reporter Info */}
            <div className="p-4 bg-blue-50 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-blue-500 mb-2">
                Người Báo Cáo
              </h2>
              <div className="flex items-center space-x-4">
                <img
                  src={`http://127.0.0.1:8000${report.reportee_avt}`}
                  alt={report.reportee_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-400"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {report.reportee_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Loại báo cáo:{" "}
                    <span className="font-semibold text-blue-400">
                      {report.report_type}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Reported User Info */}
            <div className="p-4 bg-red-50 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-red-500 mb-2">
                Người Bị Báo Cáo
              </h2>
              <div className="flex items-center space-x-4">
                <img
                  src={`http://127.0.0.1:8000${report.reported_user_avt}`}
                  alt={report.reported_user_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-red-400"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {report.reported_user_name}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-md font-semibold text-red-500 mb-2">
              Mô tả báo cáo
            </h2>
            <p
              dangerouslySetInnerHTML={{ __html: report.description }}
              className="text-sm text-gray-700"
            ></p>
          </div>

          {/* Report Actions Section */}
          <div className="flex flex-wrap justify-between items-center text-sm text-gray-600">
            <span>{new Date(report.created_at).toLocaleString()}</span>
            <div className="flex gap-4">
              {report.report_type === "Bài đăng" ||
              report.report_type === "Bình luận" ? (
                <button
                  className="px-4 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 font-semibold"
                  onClick={() =>
                    handleViewPost(report.post_id, report.comment_id)
                  }
                >
                  Đến bài đăng
                </button>
              ) : (
                <button
                  className="px-4 py-2 rounded-full text-white bg-blue-500 font-semibold"
                  onClick={() => {
                    handlePersonalProfileClick(report.reportee_id);
                  }}
                >
                  Xem thông tin người dùng
                </button>
              )}
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
      )}
    </div>
  );
};

export default ReportDetail;
