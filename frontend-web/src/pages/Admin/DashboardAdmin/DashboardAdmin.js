import Img1 from "../../../assets/image/3d-cup.png";
import Img2 from "../../../assets/image/IconuserAdmin.png";
import Img3 from "../../../assets/image/IconBaiDangAdmin.png";
import Img4 from "../../../assets/image/bill-line.png";
import ThreePoint from "../../../assets/image/more-2-line.png";
import { useState, useEffect } from "react";

const DashboardAdmin = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [newCountInMonth, setnewCountInMonth] = useState(0);
  const [newCountInWeek, setnewCountInWeek] = useState(0);

  const maxUserCount = 400; // Giá trị tối đa
  const maxPostCount = 300;
  const maxNewsCount = 400;
  const maxnewCountInMonth = 44;
  const weeklyData = [
    { label: "2", registrations: 1 },
    { label: "3", registrations: 2 },
    { label: "4", registrations: 3 },
    { label: "5", registrations: 1 },
    { label: "6", registrations: 3 },
    { label: "7", registrations: 12 },
    { label: "CN", registrations: 0 },
  ];

  const totalRegistrations = weeklyData.reduce(
    (total, day) => total + day.registrations,
    0
  );
  const maxtotalRegistrationsInWeek = totalRegistrations;
  console.log(totalRegistrations);
  useEffect(() => {
    setTimeout(() => {
      setIsAnimated(true);
    }, 50);

    const userInterval = setInterval(() => {
      setUserCount((prev) => (prev < maxUserCount ? prev + 1 : maxUserCount));
    }, 5); // Thay đổi giá trị này để điều chỉnh tốc độ

    const postInterval = setInterval(() => {
      setPostCount((prev) => (prev < maxPostCount ? prev + 1 : maxPostCount));
    }, 5);

    const newsInterval = setInterval(() => {
      setNewsCount((prev) => (prev < maxNewsCount ? prev + 1 : maxNewsCount));
    }, 5);

    const newCountInMonthInterval = setInterval(() => {
      setnewCountInMonth((prev) => (prev < maxnewCountInMonth ? prev + 1 : maxnewCountInMonth));
    }, 50);

    const newtotalRegistrationsInWeek = setInterval(() => {
      setnewCountInWeek((prev) => (prev < maxtotalRegistrationsInWeek ? prev + 1 : maxtotalRegistrationsInWeek));
    }, 30);
    // Dọn dẹp interval khi component unmount
    return () => {
      clearInterval(userInterval);
      clearInterval(postInterval);
      clearInterval(newsInterval);
      clearInterval(newCountInMonthInterval);
      clearInterval(newtotalRegistrationsInWeek);

    };
  }, [maxtotalRegistrationsInWeek]);

  return (
    <div className="w-full h-full p-3">
      <div className="w-full h-[30%] flex gap-5">
        <div className="w-[33%] bg-white p-5 rounded-lg">
          <strong className="font-semibold">
            Số người đăng ký trong tháng
          </strong>
          <p className="opacity-50 text-[14px]">Tháng 10</p>
          <div className="flex w-[100%]">
            <div className="flex flex-col text-left gap-3 mt-3 w-[80%]">
              <strong className="text-xl font-semibold text-sky-600">
                + {newCountInMonth} người dùng
              </strong>
              <p className="opacity-50">
                Tăng <i>100%</i> so với tháng trước
              </p>
              <button className="w-[80px] h-[30px] rounded-sm bg-sky-600 text-white">
                Chi tiết
              </button>
            </div>
            <img src={Img1} alt="" />
          </div>
        </div>
        <div className="w-[63%] bg-white p-5 rounded-lg">
          <div className="flex justify-between">
            <div>
              <strong className="font-semibold">Bảng thống kê</strong>
              <p className="opacity-50 text-[14px]">
                Cập nhật gần nhất <i>20:00 24/10/2024</i>
              </p>
            </div>
            <img src={ThreePoint} alt="" />
          </div>
          <div className="mt-16 flex justify-between w-[80%]">
            <div className="flex gap-3">
              <div className="w-[46px] h-[46px] bg-green-600 rounded-md flex items-center">
                <img className="w-1/2 h-1/2 m-auto" src={Img2} alt="" />
              </div>
              <div className="flex flex-col justify-between">
                <strong className="opacity-90">Người dùng</strong>
                <i className="font-semibold text-[18px]">{userCount} +</i>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-[46px] h-[46px] bg-orange-400 rounded-md flex items-center">
                <img className="w-1/2 h-1/2 m-auto" src={Img3} alt="" />
              </div>
              <div className="flex flex-col justify-between">
                <strong className="opacity-90">Bài đăng</strong>
                <i className="font-semibold text-[18px]">{postCount} +</i>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-[46px] h-[46px] bg-blue-400 rounded-md flex items-center">
                <img className="w-1/2 h-1/2 m-auto" src={Img4} alt="" />
              </div>
              <div className="flex flex-col justify-between">
                <strong className="opacity-90">Tin tức</strong>
                <i className="font-semibold text-[18px]">{newsCount} +</i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[63%] flex gap-5 mt-6">
        <div className="w-[33%] bg-white p-5 rounded-lg">
          <strong className="font-bold text-lg mb-4">Người đăng ký trong tuần</strong>
          <p className="text-[14px] opacity-50">12/02/2024 - 19/02/2024</p>
          <div className="flex justify-between items-end h-56">
            {weeklyData.map((day, index) => {
              const heightPercentage =
                totalRegistrations > 0
                  ? (day.registrations / totalRegistrations) * 100
                  : 0;
              const actualHeight = (heightPercentage / 100) * 200;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-between "
                >
                  <div
                    className={`bg-blue-500 w-8 transition-all duration-1000 ease-out transform ${
                      isAnimated
                        ? "opacity-100 scale-y-100"
                        : "opacity-0 scale-y-0"
                    }`}
                    style={{
                      height: `${actualHeight}px`,
                       transformOrigin: "bottom",
                    }}
                  ></div>

                  <span className="mt-2 text-sm">{day.label}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 mt-5 justify-center">
              <div className="w-[46px] h-[46px] bg-violet-300 rounded-md flex items-center">
                <img className="w-1/2 h-1/2 m-auto" src={Img2} alt="" />
              </div>
              <div className="flex flex-col justify-between">
              <i className="font-semibold text-[18px]">+ {newCountInWeek}</i>
                <strong className="opacity-90">Người dùng</strong>
                
              </div>
            </div>
         
        </div>
        <div className="w-[63%] bg-white p-5 rounded-lg">
          <strong className="font-bold text-lg mb-4">Danh sách tài khoản mới nhất</strong>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
