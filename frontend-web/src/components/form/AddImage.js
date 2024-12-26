import React, { useState, useEffect } from "react";
import { ImagePlus, X, Upload } from "lucide-react";

const AddImage = ({ onClose, onConfirm, compulsory }) => {
  const [hasUploaded, setHasUploaded] = useState(false);

  // Ngăn người dùng rời trang nếu chưa tải ảnh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!hasUploaded) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUploaded]);

  const handleConfirm = () => {
    setHasUploaded(true);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300">
      {/* Normal Image Upload Dialog */}
      {compulsory === false && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 transform transition-all duration-300 scale-100 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ImagePlus className="w-6 h-6 text-blue-500" />
              Thêm ảnh bài đăng
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="mb-8 text-gray-600">
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="leading-relaxed">
                Thêm hình ảnh sẽ giúp bài đăng của bạn thu hút hơn và tăng khả
                năng tiếp cận với người mua tiềm năng.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
            >
              <ImagePlus className="w-5 h-5" />
              Thêm ảnh
            </button>
          </div>
        </div>
      )}

      {/* Compulsory Image Upload Dialog */}
      {compulsory === true && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-[50rem] transform transition-all duration-300 scale-100 hover:scale-[1.02]">
          <div className="flex flex-col items-center text-center mb-6 border-solid border-b-2 border-gray-600 pb-2">
            <h2 className="text-xl font-bold text-gray-800">
              Tải lên ảnh minh chứng
            </h2>
          </div>

          <div className="mb-8">
            <div className="bg-orange-50 p-4 rounded-xl">
              <p className="text-gray-600 leading-relaxed font-semibold">
                Vui lòng tải lên ít nhất 1 ảnh để chứng minh các thông tin về
                giấy tờ pháp lý hoặc vị trí bất động sản trên giấy tờ.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleConfirm}
              className="px-6 py-3 font-semibold rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-red-200"
            >
              <Upload className="w-5 h-5" />
              Tiếp tục tải ảnh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddImage;
