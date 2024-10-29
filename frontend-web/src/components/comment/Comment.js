import { useState, useEffect } from "react";

const Comment = ({ id, sessionToken }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/posts/${id}/comments/`
        );
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/posts/${id}/comments/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment }),
        }
      );

      if (response.ok) {

        console.log("Comment posted successfully");
        setComment("");
        window.location.reload();
      } else {
        console.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  return (
    <div className="flex flex-col justify-start items-center h-screen mr-5">
      <div className="flex flex-col items-center p-6 mt-5 mb-5 mr-5 h-full w-full mx-auto rounded-lg bg-white border-double border-[#3CA9F9] border-[2px] shadow-md">
        <h1 className="text-2xl font-bold text-[#3CA9F9] mb-4">Bình luận</h1>

        {/* List of Comments */}
        <ul className="w-full flex flex-col items-start overflow-y-auto mt-4">
          {comments.map((comment) => (
            <li
              key={comment.comment_id}
              className="flex flex-col items-start mb-4"
            >
              <div className="flex items-center">
                <img
                  src={
                    // comment.user.avatar ||
                    "https://th.bing.com/th/id/OIP.jbWA3pC_GsfnBH5IohOa8gHaFB?rs=1&pid=ImgDetMain"
                  }
                  alt=""
                  className="w-16 h-16 rounded-full mr-3"
                />
                <span className="font-semibold">{comment.username}</span>
              </div>
              {/* Phần nội dung bình luận */}
              <p className="ml-20 text-gray-700 bg-blue-300 p-3 rounded-md max-w-[20rem]">
                {comment.comment}
              </p>
            </li>
          ))}
        </ul>

        {/* Comment Input */}
        <div className="flex flex-col items-center justify-center w-full">
          <textarea
            name="comment"
            id="comment"
            cols="30"
            rows="10"
            className="w-[25rem] h-[5rem] border-[2px] border-double border-[#3CA9F9] rounded-[0.5rem] p-2 mt-4"
            placeholder="Hãy nhập bình luận của bạn..."
            value={comment}
            onChange={handleCommentChange}
          ></textarea>
          <button
            className="bg-[#3CA9F9] text-white px-5 py-3 rounded-md mt-2"
            onClick={handleCommentSubmit}
          >
            Bình luận
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
