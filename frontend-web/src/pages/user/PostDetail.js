import ImageCard from "../../components/image_card/ImageCard";
import DetailDescription from "../../components/detail_description/DetailDescription";
import BasicInformation from "../../components/basic_information/BasicInformation";
import ProfileInformation from "../../components/profile_information/ProfileInformation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faComment,
  faShareAlt,
  faBookmark,
  faListAlt,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
// import description from "../../components/mock_data/description";

const DetailPost = () => {
const description = `+ Vị trí: Đều là dòng hoa hậu gần công viên, gần 12 tòa chung cư, đi bộ
3 bước ra khách sạn 5 sao Mariot. Nằm kề cận TP.HCM, đồng thời cũng là
địa bàn phát triển mạnh về kinh tế, có nhiều khu công nghiệp nên ngoài
hai thị trường lớn nhất cả nước (Hà Nội, TP.HCM), Bình Dương là một
trong ít tỉnh thành có nhu cầu lớn về căn hộ chung cư. Tuy nhiên, trong
hơn 2 năm qua, các dự án mới tại Bình Dương hầu hết đều tập trung ở phân
khúc căn hộ trung, cao cấp, "tìm đỏ mắt" cũng không thấy căn hộ có giá
quanh 1 tỷ đồng. Theo dữ liệu trực tuyến của Batdongsan.com.vn, trong
nửa đầu năm 2024, giá căn hộ Bình Dương trung bình từ 35-40 triệu
đồng/m2. Như vậy với căn hộ diện tích khoảng hơn 60m2 đã có giá từ 2 tỷ
đồng. Những dự án liền kề TP.HCM giá trung bình thậm chí đã quanh ngưỡng
45-50 triệu đồng/m2. Giá căn hộ tăng liên tiếp trong 2-3 năm qua khiến
thanh khoản trên thị trường gặp nhiều khó khăn, dù nhu cầu mua căn hộ
tại đây vẫn rất lớn. Chưa kể, nguồn cung ra thị trường "lệch pha" với
nhu cầu và khả năng chi trả của người dân. Theo đó, đa số các căn hộ tại
Bình Dương hiện nay đều ở tầm giá từ 2-3 tỷ đồng/căn trở lên, trong khi
với thu nhập bình quân đầu người của Bình Dương trung bình khoảng 120
triệu/năm thì căn hộ "vừa túi tiền" nằm ở khoảng giá 900 triệu đến dưới
1,5 tỷ đồng. Tình trạng này khiến Bình Dương thiếu căn hộ phục vụ nhu
cầu thực, trong khi lại dư thừa căn hộ giá cao. Thanh khoản kém, khiến
nguồn cung ế nhưng lại thiếu vì không đáp ứng đúng nguồn cầu.`;

    const [isClicked, setIsClicked] = useState(false);
    const handleClick = () => {
      setTimeout(() => {
        setIsClicked(!isClicked);
      }, 80);
    };

    const [isSaved, setIsSaved] = useState(false);
    const handleSaveClick = () => {
      setTimeout(() => {
        setIsSaved(!isSaved);
      }, 80);
    }



  return (
    <div className="flex flex-col items-center bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-400 font-montserrat">
      <h3 className="mt-5 p-2 text-2xl font-bold text-white flex items-center gap-2 pl-5 w-[22rem] shadow-2xl shadow-[#E4FFFC] rounded-[3rem]">
        <FontAwesomeIcon
          icon={faListAlt}
          className="text-white bg-[#3CA9F9] p-3 w-5 h-5 rounded-full"
        />
        Chi tiết bài đăng
      </h3>
      <div className="p-6 mt-5 mb-5 max-w-5xl mx-auto rounded-lg bg-white border-double border-[#3CA9F9] border-[2px] shadow-md ">
        <h1 className="text-2xl font-bold text-[#3CA9F9] mb-4">
          Cho thuê nhà ở tại 123 Tôn Đức Thắng đối diện ...
        </h1>

        {/* Profile + reaction */}
        <div className="flex flex-row justify-between">
          <ProfileInformation />
          <div className="flex space-x-8 mt-4 justify-end">
            {/* Heart */}
            <div className="flex items-end text-gray-500 space-x-1">
              <button onClick={handleClick} className="focus:outline-none">
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`w-8 h-8 transition duration-100 ${
                    isClicked ? "text-red-400" : "text-gray-500"
                  }`}
                />
              </button>
              <span>33</span>
            </div>
            {/* Chat */}
            <div className="flex items-end text-gray-500 space-x-1">
              <FontAwesomeIcon icon={faComment} className="w-8 h-8" />
              <span>124</span>
            </div>
            {/* Share */}
            <div className="flex items-end text-gray-500 space-x-1">
              <FontAwesomeIcon icon={faShareAlt} className="w-8 h-8" />
              <span>124</span>
            </div>
            {/* Save */}
            <div className="flex items-end text-gray-500 space-x-1">
              <button onClick={handleSaveClick} className="focus:outline-none">
                <FontAwesomeIcon
                  icon={faBookmark}
                  className={`w-8 h-8 transition duration-100 ${
                    isSaved ? "text-yellow-400" : "text-gray-500"
                  }`}
                />
              </button>

              <span>2</span>
            </div>
          </div>
        </div>

        <BasicInformation />
        <ImageCard
          title="Hình ảnh mô tả:"
          imageUrl="https://th.bing.com/th/id/OIP.jbWA3pC_GsfnBH5IohOa8gHaFB?rs=1&pid=ImgDetMain"
        />

        <DetailDescription description={description} maxLength={5000000} />
      </div>
    </div>
  );
};
export default DetailPost;
