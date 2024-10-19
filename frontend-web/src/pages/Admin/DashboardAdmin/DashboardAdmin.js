const DashboardAdmin = () => {
  return (
    <div className="w-full h-full p-3 ">
      <div className="w-full h-[30%] flex gap-5">
        <div className="w-[33%] bg-white p-5 rounded-lg">
          <p>Số người đăng ký trong tháng</p>
        </div>
        <div className="w-[63%] bg-white p-5 rounded-lg">
          <p>Bảng thống kê</p>
        </div>
      </div>
      <div className="w-full h-[63%] flex gap-5 mt-6">
      <div className="w-[33%] bg-white p-5 rounded-lg">
          <p>Người đăng ký trong tuần</p>
        </div>
        <div className="w-[63%] bg-white p-5 rounded-lg">
          <p>Danh sách tài khoản gần nhất</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
