const Comment = () => {
  return (
    <div className="flex flex-col justify-start items-start h-screen mr-5">
      <div className="flex flex-col items-center justify-between p-6 mt-5 mb-5 mr-5 h-full w-full mx-auto rounded-lg bg-white border-double border-[#3CA9F9] border-[2px] shadow-md">
        <h1 className="text-2xl font-bold text-[#3CA9F9] mb-4">Bình luận</h1>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <img
                src="https://th.bing.com/th/id/OIP.jbWA3pC_GsfnBH5IohOa8gHaFB?rs=1&pid=ImgDetMain"
                alt=""
                className="w-16 h-16 rounded-full"
              />
              <span>Nguyễn Văn A</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <img
                src="https://th.bing.com/th/id/OIP.jbWA3pC_GsfnBH5IohOa8gHaFB?rs=1&pid=ImgDetMain"
                alt=""
                className="w-16 h-16 rounded-full"
              />
              <span>Nguyễn Văn B</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <img
                src="https://th.bing.com/th/id/OIP.jbWA3pC_GsfnBH5IohOa8gHaFB?rs=1&pid=ImgDetMain"
                alt=""
                className="w-16 h-16 rounded-full"
              />
              <span>Nguyễn Văn C</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <textarea
              name="comment"
              id="comment"
              cols="30"
              rows="10"
              className="w-[20rem] h-[10rem] border-[2px] border-double border-[#3CA9F9] rounded-[0.5rem] p-2"
              placeholder="Nhập bình luận..."
            ></textarea>
            <button className="bg-[#3CA9F9] text-white px-5 py-3 rounded-md mt-2">
              Bình luận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
