import PropTypes from "prop-types";
import SideBar from "../sidebar/SideBar";

const Panel = ({ children }) => {
  return (
    <div className="flex flex-col mt-4 main-content ">
      <div>
        <ul className="flex gap-5 mb-5">
          <li className="">Bài đăng nổi bật</li>
          <li>Dành cho bạn</li>
          <li>Bài đăng gần nhất</li>
        </ul>
      </div>
      <div className="flex p-6 justify-between bg-[#fff]">

        <div className=" min-h-[50vh] p-4 rounded-lg mb-4">
          {children}
        </div>
        <SideBar />
      </div>
      
    </div>
  );
};

Panel.propTypes = {
  children: PropTypes.node,
};

export default Panel;
