const PersonalPage = () => {
  return (
    <div className="flex flex-row h-screen w-screen">
      {/* SideBar Function */}
      <div className="flex flex-col w-[22%] items-center justify-center bg-red-600"></div>
      {/* Main Content */}
      <div className="flex flex-col w-[50%] items-center justify-center bg-blue-600">
        Personal Information
      </div>
      {/* SideBar User */}
      <div className="flex flex-col w-[28%] items-center justify-start bg-slate-600">
        {/* Infor */}
        <div className="flex flex-row gap-5 mt-7 items-center justify-start bg-green-600 w-[80%] h-[6rem] p-5 rounded-2xl">
          <div className="">
            <img
              src="https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/464296711_1093951465494494_6868377558145451420_n.jpg?stp=dst-jpg_s600x600&_nc_cat=103&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=8QXVzu1YyP8Q7kNvgFFAB1g&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=AAdpkZ5lvm3XPtd4ZmhRqX9&oh=00_AYBr_j-1SM79yuWuR9zBcKcDhX6gK5TiDO_EnZrgQVXcCA&oe=671D30F3"
              alt="Avatar"
              className="w-[5rem] h-[5rem] rounded-full"
            />
          </div>
          <div className="font-montserrat">Username</div>
        </div>
        <div className="grid grid-cols-1 gap-5 mt-5 w-[80%]">
            <div className="flex flex-row items-center justify-start bg-yellow-600 w-full h-[3rem] p-5 rounded-2xl">
                <div className="font-montserrat">Danh sách bài đăng</div>
            </div>
            <div className="flex flex-row items-center justify-start bg-yellow-600 w-full h-[3rem] p-5 rounded-2xl">
                <div className="font-montserrat">Bài đăng đã lưu</div>
            </div>
            <div className="flex flex-row items-center justify-start bg-yellow-600 w-full h-[3rem] p-5 rounded-2xl">
                <div className="font-montserrat">Bài đăng đã ẩn</div>
            </div>
            <div className="flex flex-row items-center justify-start bg-yellow-600 w-full h-[3rem] p-5 rounded-2xl">
                <div className="font-montserrat">Bài đăng đã bán</div>
                </div>
            <div className="flex flex-row items-center justify-start bg-yellow-600 w-full h-[3rem] p-5 rounded-2xl">
                <div className="font-montserrat">Bài đăng đã ẩn</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalPage;
