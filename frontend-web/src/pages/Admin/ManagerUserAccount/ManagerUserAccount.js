import React, { useState, useEffect } from "react";
import Pagination from "../../Pagination/Pagination";

const ManagerUserAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(10);

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
  const currentAccounts = accounts.slice(indexOfFirstAccount, indexOfLastAccount);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  if (loading) {
    return <div className="text-center">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white h-full">
    <h2 className="text-2xl font-semibold mb-6 text-center">Danh Sách Tài Khoản</h2>
  
    <div className="hidden md:flex justify-between bg-blue-500 text-white p-4 rounded-t-lg">
      <div className="w-1/6">Tên Người Dùng</div>
      <div className="w-1/4">Email</div>
      <div className="w-1/5">Số Điện Thoại</div>
      <div className="w-1/8">Quyền</div>
      <div className="w-1/6 text-center">Tác vụ</div>
    </div>
  
    {currentAccounts.length > 0 ? (
      currentAccounts.map((account) => (
        <div
          key={account.user_id}
          className="flex flex-col md:flex-row justify-between items-center p-4 border-b border-gray-200"
        >
          <div className=" w-1/6 mb-2 md:mb-0 text-center md:text-left overflow-hidden text-ellipsis whitespace-nowrap">
            {account.user.username}
          </div>
          <div className="w-1/4 mb-2 md:mb-0 text-center md:text-left overflow-hidden text-ellipsis whitespace-nowrap">
            {account.user.email}
          </div>
          <div className="w-1/5 mb-2 md:mb-0 text-center md:text-left overflow-hidden text-ellipsis whitespace-nowrap">
            {account.phone_number || 'Trống'}
          </div>
          <div className="w-1/8 mb-2 md:mb-0 text-center md:text-left overflow-hidden text-ellipsis whitespace-nowrap">
            {account.role || 'Trống'}
          </div>
          <div className="w-1/6 flex justify-end space-x-2">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Sửa
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Xóa
            </button>
          </div>
        </div>
      ))
    ) : (
      <div className="text-center">Không có tài khoản nào.</div>
    )}
  
    {/* Pagination */}
    <Pagination
      accountsPerPage={accountsPerPage}
      totalAccounts={accounts.length}
      paginate={paginate}
    />
  </div>
  
  );
};

export default ManagerUserAccount;
