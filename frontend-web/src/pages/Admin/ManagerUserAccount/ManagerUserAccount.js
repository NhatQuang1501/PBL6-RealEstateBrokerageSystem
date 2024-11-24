import React, { useState, useEffect } from "react";
import Pagination from "../../Pagination/Pagination";

const ManagerUserAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(4);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/auth/users/");
        const data = await res.json();
        setAccounts(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = accounts.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="text-center text-lg font-medium">Đang tải dữ liệu...</div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
        Danh Sách Tài Khoản
      </h2>

      <div className="overflow-x-auto shadow-sm border rounded-lg">
        <table className="min-w-full border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-blue-100 text-gray-800">
              <th className="border border-gray-300 px-4 py-3 text-center">
                STT
              </th>
              <th className="border border-gray-300 px-4 py-3">Email</th>
              <th className="border border-gray-300 px-4 py-3">Username</th>
              <th className="border border-gray-300 px-4 py-3">Họ Tên</th>
              <th className="border border-gray-300 px-4 py-3">Thành Phố</th>
              <th className="border border-gray-300 px-4 py-3">Ngày Sinh</th>
              <th className="border border-gray-300 px-4 py-3">
                Số Điện Thoại
              </th>
              <th className="border border-gray-300 px-4 py-3">Giới Tính</th>
              <th className="border border-gray-300 px-4 py-3 text-center">
                Ảnh Đại Diện
              </th>
            </tr>
          </thead>
          <tbody>
            {currentAccounts.map((account, index) => {
              const user = account.user || {};
              return (
                <tr key={account.user_id} className="hover:bg-blue-50">
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {indexOfFirstAccount + index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {user.email || "Chưa có thông tin"}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {user.username || "Chưa có thông tin"}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {account.fullname || "Chưa có thông tin"}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {account.city || "Chưa có thông tin"}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {account.birthdate || "Chưa có thông tin"}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {account.phone_number || "Chưa có thông tin"}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center text-gray-600">
                    {account.gender || "Chưa có thông tin"}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {account.avatar ? (
                      <img
                        src={`http://127.0.0.1:8000${account.avatar}`}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full mx-auto border"
                      />
                    ) : (
                      <span className="italic text-gray-500">
                        Chưa có thông tin
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination
          accountsPerPage={accountsPerPage}
          totalAccounts={accounts.length}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default ManagerUserAccount;
