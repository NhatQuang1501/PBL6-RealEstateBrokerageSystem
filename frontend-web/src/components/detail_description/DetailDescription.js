import React from "react";
import PropTypes from "prop-types";
import { FaQuoteLeft } from "react-icons/fa";
import { useLocation } from "react-router-dom"; // Import hook useLocation
import "react-quill/dist/quill.snow.css";

const DetailDescription = ({
  description,
  maxLength,
  enableToggle,
  moreLink,
}) => {
  const location = useLocation();
  const isDetailPostPage = location.pathname.includes("detail-post");

  const safeDescription = description || "";
  const truncatedText =
    safeDescription.length > maxLength
      ? safeDescription.substring(0, maxLength) + "..."
      : safeDescription;

  return (
    <div className="border-[1px] border-double border-gray-200 rounded-lg p-4 space-y-2 shadow-md">
      <div className="mb-3 flex text-lg">
        <FaQuoteLeft className="text-2xl text-blue-500" />{" "}
        <h2 className="text-gray-600 underline text-lg mb-1 ml-5 font-extrabold">
          {" "}
          Thông tin chi tiết :{" "}
        </h2>
      </div>
      <div
        className={`text-gray-800 ${
          isDetailPostPage ? "text-lg" : "text-xs font-medium"
        } break-words whitespace-pre-wrap`}
        dangerouslySetInnerHTML={{ __html: truncatedText }}
      />
      {safeDescription.length > maxLength && !enableToggle && (
        <a href={moreLink} className="text-blue-500 text-sm italic">
          xem thêm...
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
