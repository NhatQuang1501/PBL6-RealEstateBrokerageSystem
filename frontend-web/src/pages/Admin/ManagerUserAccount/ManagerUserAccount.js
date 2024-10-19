import React, { useState, useEffect } from "react";
import Pagination from "../../Pagination/Pagination";

const ManagerUserAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(10);

  useEffect(() => {
    fetch("/api/accounts")
      .then((res) => res.json())
      .then((data) => setAccounts(data))
      .catch((err) => console.log(err));
  }, []);

  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = accounts.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-6 bg-white h-full">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Danh Sách Tài Khoản
      </h2>

      <div className="hidden md:flex justify-between bg-blue-500 text-white p-4 rounded-t-lg">
        <div className="w-1/5">Tên Người Dùng</div>
        <div className="w-1/5">Email</div>
        <div className="w-1/5">Role</div>
        <div className="w-1/5 text-right">Trạng thái</div>
        <div className="w-1/5 text-right">Tác vụ</div>
      </div>

      {currentAccounts.map((account) => (
        <div
          key={account.id}
          className="flex flex-col md:flex-row justify-between items-center p-4 border-b border-gray-200"
        >
          <div className="w-full md:w-1/4 mb-2 md:mb-0 text-center md:text-left">
            {account.username}
          </div>
          <div className="w-full md:w-1/4 mb-2 md:mb-0 text-center md:text-left">
            {account.email}
          </div>
          <div className="w-full md:w-1/4 mb-2 md:mb-0 text-center md:text-left">
            {account.phoneNumber}
          </div>
          <div className="w-full md:w-1/4 flex justify-end space-x-2">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Sửa
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Xóa
            </button>
          </div>
        </div>
      ))}

      <Pagination
        accountsPerPage={accountsPerPage}
        totalAccounts={accounts.length}
        paginate={paginate}
      />
    </div>
  );
};

export default ManagerUserAccount;
