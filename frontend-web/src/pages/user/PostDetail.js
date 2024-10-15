import ImageCard from "../../components/image_card/ImageCard";
import DetailDescription from "../../components/detail_description/DetailDescription";

const DetailPost = () => {
  return (
    <div className="p-6 mt-5 mb-5 max-w-5xl mx-auto bg-white rounded-lg border border-blue-200 shadow-md font-montserrat">
      <h1 className="text-2xl font-bold text-[#3CA9F9] mb-4">
        Cho thuê nhà ở tại 123 Tôn Đức Thắng đối diện ...
      </h1>

      {/* Main */}
      <div className="mb-6 border-2 border-double border-[#3CA9F9] rounded-lg p-4">
        <div className="mb-4 text-sm text-gray-600">
          <p>
            Bài viết của:{" "}
            <span className="font-semibold text-black">Nguyễn Văn A</span>
          </p>
          <p>12:00 pm 09/10/2024</p>
          <p>
            Địa chỉ: 123 Tôn Đức Thắng, Hòa Khánh Bắc, Quận Liên Chiểu, thành
            phố Đà Nẵng
          </p>
        </div>

        <div className="mb-4 flex justify-between text-sm">
          <p>
            Mức giá: <span className="font-semibold text-black">6,3 tỷ</span>
          </p>
          <p>
            Diện tích: <span className="font-semibold text-black">85 m²</span>
          </p>
          <p className="text-gray-500">~74,12 triệu/m²</p>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <button className="flex items-center px-4 py-2 border border-[#3CA9F9] rounded-lg text-[#3CA9F9] hover:bg-blue-100 transition">
            {/* <BookmarkIcon className="h-5 w-5 mr-2" /> */}
            Lưu tin này
          </button>

          <button className="flex items-center px-4 py-2 border border-[#3CA9F9] rounded-lg text-[#3CA9F9] hover:bg-blue-100 transition">
            {/* <ShareIcon className="h-5 w-5 mr-2" /> */}
            Chia sẻ
          </button>

          <button className="flex items-center px-4 py-2 border border-[#3CA9F9] rounded-lg text-[#3CA9F9] hover:bg-blue-100 transition">
            {/* <ExclamationTriangleIcon className="h-5 w-5 mr-2" /> */}
            Báo cáo
          </button>
        </div>

        <div className="flex items-center space-x-6 text-gray-600 text-sm">
          <div className="flex items-center">
            {/* <HeartIcon className="h-5 w-5 text-black mr-1" /> */}
            <span>33</span>
          </div>

          <div className="flex items-center">
            {/* <ChatBubbleLeftIcon className="h-5 w-5 text-black mr-1" /> */}
            <span>124</span>
          </div>

          <div className="flex items-center">
            {/* <EyeIcon className="h-5 w-5 text-black mr-1" /> */}
            <span>1249</span>
          </div>
        </div>
      </div>
      <ImageCard
        title="Hình ảnh mô tả:"
        imageUrl="https://th.bing.com/th/id/OIP.jbWA3pC_GsfnBH5IohOa8gHaFB?rs=1&pid=ImgDetMain"
      />

      <DetailDescription />
    </div>
  );
};
export default DetailPost;