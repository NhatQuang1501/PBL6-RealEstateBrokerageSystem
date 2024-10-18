import React from "react";
import PropTypes from "prop-types";

const DetailDescription = ({
  description,
  maxLength,
  enableToggle,
  moreLink,
}) => {
  const safeDescription = description || "";
  const truncatedText =
    safeDescription.length > maxLength
      ? safeDescription.substring(0, maxLength) + "..."
      : safeDescription;

  return (
    <div className="border-[1px] border-double border-[#3CA9F9] rounded-lg p-4 space-y-2 shadow-md">
      <h2 className="text-[#3CA9F9] text-lg mb-2 font-extrabold">
        Thông tin chi tiết :
      </h2>
      <p className="leading-relaxed">{truncatedText}</p>
      {safeDescription.length > maxLength && !enableToggle && (
        <a href={moreLink} className="text-blue-500">
          xem thêm
        </a>
      )}
    </div>
  );
};

DetailDescription.propTypes = {
  description: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  enableToggle: PropTypes.bool,
  moreLink: PropTypes.string,
};

DetailDescription.defaultProps = {
  description: "",
  maxLength: 100,
  enableToggle: false,
  moreLink: "#",
};

export default DetailDescription;
