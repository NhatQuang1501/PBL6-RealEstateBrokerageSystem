const SideBar = () => {
  return (
    <div className="flex w-[25%] p-3">
      <div className="bg-white border-double border-4 border-[#3CA9F9] w-[100%] max-h-[120vh] p-3 rounded-lg mb-4 mr-5 text-left">
        <h1 className="text-[15px] font-bold ">Lọc theo khoảng giá</h1>
        <ul className="text-gray-700 text-left mt-2">
          <li className="p-2 opacity-80 cursor-pointer hover:opacity-100">Thỏa thuận</li>
          <li className="p-2 opacity-80 cursor-pointer hover:opacity-100">Dưới 500 tr</li>
          <li className="p-2 opacity-80 cursor-pointer hover:opacity-100">Dưới 1 tỷ</li>
          <li className="p-2 opacity-80 cursor-pointer hover:opacity-100">Dưới 2 tỷ</li>
          <li className="p-2 opacity-80 cursor-pointer hover:opacity-100">Dưới 5 tỷ</li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
