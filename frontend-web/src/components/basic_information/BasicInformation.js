const BasicInformation = () => {
  return (
    <div className="grid grid-cols-5 gap-2 p-4 mt-5 border-[1px] border-[#3CA9F9] border-double rounded-lg justify-center items-center">
      <div className="p-2 border-2 border-gray-200 border-double rounded-[20rem] bg-[#E4FFFC]">
        <p className="text-red-500 font-semibold">Giá: </p>
        <p>12.000.000.000 VND</p>
      </div>
      <div className="p-2 border-2 border-gray-200 border-double rounded-[20rem] bg-[#E4FFFC]">
        <p className="text-red-500 font-semibold">Diện tích: </p>
        <p>1000 m2</p>
      </div>
      <div className="p-2 border-2 border-gray-200 border-double rounded-[20rem] bg-[#E4FFFC]">
        <p className="font-semibold">Kích thước: </p>
        <p>500m x 20m</p>
      </div>
      <div className="p-2 border-2 border-gray-200 border-double rounded-[20rem] bg-[#E4FFFC]">
        <p className="font-semibold">Mặt tiền: </p>
        <p>10m5</p>
      </div>
      <div className="p-2 border-2 border-gray-200 border-double rounded-[20rem] bg-[#E4FFFC]">
        <p className="font-semibold">Hướng: </p>
        <p>Đông Nam</p>
      </div>
      <div className="p-2 border-2 border-gray-200 border-double rounded-[20rem] bg-[#E4FFFC]">
        <p className="font-semibold">Số tầng: </p>
        <p>4 tầng</p>
      </div>
      <div className="p-2 border-2 border-gray-200 border-double rounded-[20rem] bg-[#E4FFFC]">
        <p className="font-semibold">Phòng ngủ: </p>
        <p>10</p>
      </div>
      <div className="p-2 border-2 border-gray-200 border-double rounded-[20rem] bg-[#E4FFFC]">
        <p className="font-semibold">Phòng tắm: </p>
        <p>7</p>
      </div>
      <div className="p-2 border-2 border-gray-200 border-double rounded-[20rem] bg-[#E4FFFC]">
        <p className="font-semibold">Địa chỉ: </p>
        <p>45 Nguyễn Hoàng, Hải Châu, Đà Nẵng</p>
      </div>
      <div className="p-2 border-2 border-gray-200 border-double rounded-[20rem] bg-[#E4FFFC]">
        <p className="font-semibold">Ghi chú: </p>
        <p>Nhà đẹp giá rẻ</p>
      </div>
    </div>
  );
};

export default BasicInformation;
