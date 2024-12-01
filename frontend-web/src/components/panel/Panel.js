import PropTypes from "prop-types";
import SideBar from "../sidebar/SideBar";
// import { useState } from "react";

const Panel = ({
  children,
  type,
  setFilterLegalValue,
  setFilterOrientationValue,
  setFilterBedroomValue,
  setFilterBathroomValue,
  setFilterDistrictValue,
}) => {
  return (
    <>
      {type !== "personal-page" ? (
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="bg-gradient-to-r from-[#fafffe] via-[#e0f7fa] to-[#b2ebf2] min-h-[500vh] p-4 rounded-lg mb-4">
              {children}
            </div>
          </div>
          <SideBar
            setFilterLegalValue={setFilterLegalValue}
            setFilterOrientationValue={setFilterOrientationValue}
            setFilterBedroomValue={setFilterBedroomValue}
            setFilterBathroomValue={setFilterBathroomValue}
            setFilterDistrictValue={setFilterDistrictValue}
          />
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#fafffe] via-[#e0f7fa] to-[#b2ebf2] min-h-auto p-4 rounded-lg mb-4">
          {children}
        </div>
      )}
    </>
  );
};

Panel.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  setFilterLegalValue: PropTypes.func.isRequired,
  setFilterOrientationValue: PropTypes.func.isRequired,
  setFilterBedroomValue: PropTypes.func.isRequired,
  setFilterBathroomValue: PropTypes.func.isRequired,
  setFilterDistrictValue: PropTypes.func.isRequired,
};

export default Panel;
