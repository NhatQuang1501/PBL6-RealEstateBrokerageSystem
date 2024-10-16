import React from "react";

const ImageCard = ({ title, imageUrl }) => {
  return (
    <div className="border-[1px] border-double border-[#3CA9F9] rounded-lg p-4 my-4 min-h-full font-extrabold">
      <h4 className="text-[#3CA9F9] text-lg mb-2">{title}</h4>
      <div className="flex justify-center">
        <img
          src={imageUrl}
          alt=""
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default ImageCard;
