import React from "react";
import PropTypes from "prop-types";
import { FaQuoteLeft } from "react-icons/fa";
import "react-quill/dist/quill.snow.css";

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
    <div className="border-[1px] border-double border-gray-200 rounded-lg p-4 space-y-2 shadow-md">
      <div className="mb-6 flex text-xl">
        <FaQuoteLeft className="text-2xl text-blue-500" />{" "}
        <h2 className="text-gray-600 underline text-lg mb-2 ml-5 font-extrabold">
          {" "}
          Thông tin chi tiết :{" "}
        </h2>
      </div>
      <div
        className="text-gray-800 text-lg break-words whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: truncatedText }}
      />
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
