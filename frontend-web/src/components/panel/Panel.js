import PropTypes from "prop-types";
import SideBar from "../sidebar/SideBar";

const Panel = ({ children }) => {
  return (
    <div className="flex -mt-4">
      <div className="flex-1 p-6">
        <div className="bg-gray-200 min-h-[50vh] p-4 rounded-lg mb-4">
          {children}
        </div>
      </div>
      <SideBar />
    </div>
  );
};

Panel.propTypes = {
  children: PropTypes.node,
};

export default Panel;
