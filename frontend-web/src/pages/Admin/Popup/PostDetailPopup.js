import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from "../../../AppProvider"; 

const PostDetailPopup = ({ postId, onClose }) => {
  const { sessionToken } = useAppContext(); 
  const [post, setPost] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/admin/posts/${postId}/`, {
          headers: {
            Authorization: `Bearer ${sessionToken}`, 
          },
        });
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };
    if (postId) {
        setIsVisible(true); 
        fetchPostDetails();
      } else {
        setIsVisible(false); 
      }

  }, [postId, sessionToken]); 

  

  if (!post) return null;

  return (
<div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">{post.title}</h2>
        <img
          src={post.images || 'https://th.bing.com/th/id/OIP.c_e6N6YtIVI2NFhW_Ugm6wHaF7?w=246&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7'} 
          alt="Hình ảnh bài đăng"
          className="w-full h-48 object-cover mb-4 rounded"
        />
        <p><strong>Người đăng:</strong> {post.user.username}</p>
        <div className='grid grid-cols-2 gap-4 mt-3'>
        
        <p><strong>Địa chỉ:</strong> {post.address}</p>
        <p><strong>Giá:</strong> {post.price} VND</p>
        <p><strong>Diện tích:</strong> {post.area} m²</p>
        <p><strong>Thể loại bất động sản:</strong> {post.estate_type}</p>
        <p><strong>Trạng thái:</strong> {post.status}</p>
        <p><strong>Mô tả:</strong> {post.description}</p>
        </div>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Đóng
        </button>
      </div>
    </div>
  );
};

export default PostDetailPopup;
