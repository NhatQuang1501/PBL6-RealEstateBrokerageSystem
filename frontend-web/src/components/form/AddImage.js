
const AddImage = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-lg font-semibold mb-4">Thêm ảnh cho bài đăng?</h2>
        <p className="mb-6">Bạn có muốn thêm ảnh cho bài đăng này không?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Thêm ảnh
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddImage;