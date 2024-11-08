import PropTypes from "prop-types";
import SideBar from "../sidebar/SideBar";

const Panel = ({ children, type }) => {
  return (
    <>
      {type !== "personal-page" ? (
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="bg-gradient-to-r from-[#fafffe] via-[#e0f7fa] to-[#b2ebf2] min-h-[500vh] p-4 rounded-lg mb-4">
              {children}
            </div>
          </div>
          <SideBar />
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#fafffe] via-[#e0f7fa] to-[#b2ebf2] min-h-[500vh] p-4 rounded-lg mb-4">
          {children}
        </div>
      )}
    </>
  );
};

Panel.propTypes = {
  children: PropTypes.node,
};

export default Panel;
