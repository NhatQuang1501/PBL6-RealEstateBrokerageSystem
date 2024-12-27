import ImageCard from "../../components/image_card/ImageCard";
import DetailDescription from "../../components/detail_description/DetailDescription";
import BasicInformation from "../../components/basic_information/BasicInformation";
import ProfileInformation from "../../components/profile_information/ProfileInformation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faBookmark,
  faListAlt,
  faUpload,
  faEdit,
  faTrash,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useCallback } from "react";
import {
  FaPen,
  FaDollarSign,
  FaCalendarAlt,
  FaCreditCard,
  FaStickyNote,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import Comment from "../../components/comment/Comment";
import { useAppContext } from "../../AppProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NegotiationList from "../../components/neogotiation/NegotiationList";
import MapView from "../../components/map_api/Mapbox";

const DetailPost = () => {
  const { id, sessionToken, role } = useAppContext();
  const { postId } = useParams();
  const [post, setPost] = useState();
  const [isClicked, setIsClicked] = useState();
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  const [reactionsCount, setReactionsCount] = useState();
  const [commentCount, setCommentCount] = useState();
  const [savesCount, setSavesCount] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [negotiationDate, setNegotiationDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [negotiationNote, setNegotiationNote] = useState("");
  // const [selectedPostIdD, setSelectedPostIdD] = useState(null);
  // const [showPopupD, setShowPopupD] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case "Đang bán":
        return "bg-gradient-to-r from-blue-400 to-blue-600";
      case "Đã bán":
        return "bg-gradient-to-r from-gray-400 to-gray-600";
      case "Đang thương lượng":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      default:
        return "bg-gradient-to-r from-red-400 to-red-600";
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSaveClick = () => {
    setTimeout(() => {
      setIsSaved(!isSaved);
    }, 80);
  };

  const handleUpdate = (postId) => {
    navigate(`/user/update-post/${postId}`);
  };

  // Delete post
  const handleDelete = async (postId) => {
    const userConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa bài đăng này không?"
    );
    if (!userConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/api/posts/${postId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        console.log("Post deleted successfully");
        navigate("/user/personal-page");
      } else {
        console.error("Failed to delete the post");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Get post
  useEffect(() => {
    console.log("Post ID:", postId);
    const fetchPostById = async () => {
      try {
        // let url = `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/api/posts/${postId}/`;
        let url = `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/api/posts/${postId}/`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }

        const data = await response.json();
        console.log("Post data:", data);
        setReactionsCount(data.reactions_count);
        setCommentCount(data.comments_count);
        setSavesCount(data.save_count);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPostById();

    const checkLiked = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/api/user-posts-like/`,
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          const likedPosts = response.data.map((post) => post.post_id);
          if (likedPosts.includes(postId)) {
            setIsClicked(true);
          }
        }
      } catch (error) {
        console.error("Error checking liked posts:", error);
      }
    };
    checkLiked();

    // fetch images
  }, [postId, sessionToken]);

  // check liked
  // useEffect(() => {}, [sessionToken, postId]);

  const handleClick = useCallback(async () => {
    // setIsClicked((prevClicked) => {
    //   setReactionsCount((prevCount) =>
    //     prevClicked ? prevCount - 1 : prevCount + 1
    //   );
    //   return !prevClicked;
    // });
    if (!sessionToken) {
      alert("Bạn cần đăng nhập để thực hiện hành động này.");
      return;
    } else {
      try {
        await axios.post(
          `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/api/posts/${postId}/like/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("Error liking the post:", error);
      }
      window.location.reload();
    }
  }, [sessionToken, postId]);

  //test upload image
  const handleUploadImage = () => {
    navigate(`/upload-image/${postId}`);
  };

  // Thương lượng
  const handleNeogotiate = (postId) => {
    console.log("Negotiate post ID:", postId);
    if (!sessionToken) {
      alert("Bạn cần đăng nhập để thực hiện hành động này.");
      return;
    } else {
      setIsPopupOpen(true);
    }
  };

  const handlePriceChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9,]/g, "");
    const numericValue = value.replace(/,/g, "");
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    setPrice(formattedValue);
  };

  const handleSubmit = async () => {
    if (!price || !negotiationDate || !paymentMethod || !negotiationNote) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    const numericPrice = price.replace(/,/g, "");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/api/post-negotiations/${post.post_id}/`,
        {
          negotiation_price: parseInt(numericPrice, 10),
          negotiation_date: negotiationDate,
          payment_method: paymentMethod,
          negotiation_note: negotiationNote,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Negotiation response:", response.data);
      setIsPopupOpen(false);
      setPrice("");
      setNegotiationDate("");
      setPaymentMethod("");
      setNegotiationNote("");
      alert("Đã gửi yêu cầu thương lượng thành công!");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting negotiation:", error);
      alert(
        "Mức giá thương lượng bạn đưa ra không phù hợp. Vui lòng hãy thử lại với mức giá khác."
      );
    }
  };

  const handleClose = () => {
    setIsPopupOpen(false);
    setPrice("");
    setNegotiationDate("");
    setPaymentMethod("");
    setNegotiationNote("");
  };

  return (
    <div className="flex flex-col items-center font-montserrat">
      <div className="flex flex-row-2 gap-3 items-start justify-center">
        {/* Main content */}
        <div className="p-6 mb-5 ml-10 w-[57rem] rounded-lg bg-white">
          {post ? (
            <>
              <div className="flex items-center justify-between mb-24 ">
                <h3 className="text-xl font-bold text-blue-500 flex items-center gap-3 ">
                  <FontAwesomeIcon
                    icon={faListAlt}
                    className=" bg-white p-2 w-5 h-5 rounded-full shadow-md"
                  />
                  Chi tiết bài đăng
                </h3>

                <div className="flex items-center gap-5">
                  {post &&
                    post.user.user_id === id &&
                    post.sale_status === "Đang bán" && (
                      <button
                        className="bg-gradient-to-r from-gray-500 to-gray-400 text-white text-sm font-semibold px-2 py-2 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onClick={handleUploadImage}
                      >
                        <FontAwesomeIcon icon={faUpload} className="mr-2" />
                        Tải thêm ảnh lên
                      </button>
                    )}

                  {post &&
                    id !== post.user.user_id &&
                    role === "user" &&
                    post.sale_status !== "Đã cọc" &&
                    post.sale_status !== "Đã bán" && (
                      <div className="flex justify-center items-center">
                        <button
                          className="bg-gradient-to-r from-yellow-500 to-yellow-400 font-semibold text-black  text-sm px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform duration-200 ease-in-out hover:from-yellow-600 hover:to-yellow-500"
                          onClick={() => {
                            handleNeogotiate(post.post_id);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faHandshake}
                            className="text-lg"
                          />
                          Thương lượng
                        </button>
                        {isPopupOpen && (
                          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full">
                              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center border-b-[2px] border-gray-500 border-solid pb-2">
                                Hãy nhập giá tiền và thông tin bạn muốn thương
                                lượng
                              </h2>
                              <p className="text-sm text-gray-600 mb-6 text-center">
                                <strong className="font-bold text-red-500">
                                  Chú ý:
                                </strong>{" "}
                                Khi thương lượng, giá thương lượng mà bạn đưa ra
                                không được nhỏ hơn{" "}
                                <span className="text-red-500 font-semibold">
                                  70%
                                </span>{" "}
                                giá tiền mà chủ bài viết đã đăng bán.
                              </p>

                              {/* Trường Giá Thương Lượng */}
                              <div className="mb-4">
                                <label
                                  htmlFor="price"
                                  className="block text-gray-800 font-bold mb-2"
                                >
                                  Giá Thương Lượng (VNĐ)
                                </label>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                  <div className="px-3">
                                    <FaDollarSign className="text-gray-500" />
                                  </div>
                                  <input
                                    type="text"
                                    id="price"
                                    value={price}
                                    onChange={handlePriceChange}
                                    className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                                    placeholder="Nhập giá tiền (VNĐ)"
                                    required
                                  />
                                </div>
                              </div>

                              {/* Trường Ngày Thương Lượng */}
                              <div className="mb-4">
                                <label
                                  htmlFor="negotiationDate"
                                  className="block text-gray-800 font-bold mb-2"
                                >
                                  Ngày Bắt Đầu Giao Dịch
                                </label>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                  <div className="px-3">
                                    <FaCalendarAlt className="text-gray-500" />
                                  </div>
                                  <input
                                    type="date"
                                    id="negotiationDate"
                                    value={negotiationDate}
                                    onChange={(e) =>
                                      setNegotiationDate(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                                    required
                                  />
                                </div>
                              </div>

                              {/* Trường Hình Thức Trả Tiền */}
                              <div className="mb-4">
                                <label
                                  htmlFor="paymentMethod"
                                  className="block text-gray-800 font-bold mb-2"
                                >
                                  Hình Thức Trả Tiền
                                </label>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                  <div className="px-3">
                                    <FaCreditCard className="text-gray-500" />
                                  </div>
                                  <select
                                    id="paymentMethod"
                                    value={paymentMethod}
                                    onChange={(e) =>
                                      setPaymentMethod(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                                    required
                                  >
                                    <option value="" disabled>
                                      Chọn hình thức trả tiền
                                    </option>
                                    <option value="trả góp">Trả góp</option>
                                    <option value="một lần">
                                      Thanh toán một lần
                                    </option>
                                    <option value="trả trước">Trả trước</option>
                                    <option value="khác">Khác</option>
                                    {/* Thêm các lựa chọn khác nếu cần */}
                                  </select>
                                </div>
                              </div>

                              {/* Trường Ghi Chú Thêm */}
                              <div className="mb-6">
                                <label
                                  htmlFor="negotiationNote"
                                  className="block text-gray-800 font-bold mb-2"
                                >
                                  Ghi Chú Thêm
                                </label>
                                <div className="flex items-start border border-gray-300 rounded-lg overflow-hidden">
                                  <div className="px-3 mt-2">
                                    <FaStickyNote className="text-gray-500" />
                                  </div>
                                  <textarea
                                    id="negotiationNote"
                                    value={negotiationNote}
                                    onChange={(e) =>
                                      setNegotiationNote(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                                    placeholder="Ghi chú thêm (tùy chọn)"
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>

                              {/* Nút Xác Nhận và Hủy Bỏ */}
                              <div className="flex justify-center gap-4">
                                <button
                                  type="button"
                                  className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                                  onClick={handleSubmit}
                                >
                                  Xác nhận
                                </button>
                                <button
                                  type="button"
                                  className="bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out"
                                  onClick={handleClose}
                                >
                                  Hủy bỏ
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {post &&
                    id === post.user.user_id &&
                    post.sale_status === "Đang bán" && (
                      <>
                        <button
                          className="bg-gradient-to-r from-blue-500 to-blue-400 text-white text-sm font-semibold w-[8rem] px-2 py-2 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                          onClick={() => {
                            handleUpdate(post.post_id);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} className="text-lg" />
                          Cập nhật
                        </button>
                      </>
                    )}

                  {post && id === post.user.user_id && (
                    <>
                      <button
                        className="bg-gradient-to-r from-red-500 to-red-400 text-white text-sm font-semibold w-[8rem] px-2 py-2 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
                        onClick={() => {
                          handleDelete(post.post_id);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-lg" />
                        Xóa
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center px-2 py-4">
                <h1 className="text-xl font-semibold text-black rounded-lg flex items-center">
                  <FaPen className="mr-2" />
                  {post.title}
                </h1>
                <div
                  className={`px-5 max-w-[15rem] text-center py-2 text-white font-bold rounded-[0.5rem] ${getStatusClass(
                    post.sale_status
                  )}`}
                >
                  {post.sale_status}
                </div>
              </div>

              <div className="mt-4 flex justify-center items-center gap-10"></div>

              {/* Profile + reaction */}
              <div className="flex flex-row justify-between border-b-[2px] border-gray-300 border-solid pb-5">
                <div className="">
                  <ProfileInformation
                    name={post.user.username}
                    user_id={post.user.user_id}
                    date={post.created_at}
                  />
                </div>

                <div className="flex space-x-8 mt-4 justify-end">
                  {/* Heart */}
                  <div className="flex items-end text-gray-500 space-x-1">
                    <button
                      onClick={handleClick}
                      className="focus:outline-none"
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className={`w-6 h-6 transition duration-100 ${
                          isClicked ? "text-red-400" : "text-gray-500"
                        }`}
                      />
                    </button>
                    <span>{reactionsCount}</span>
                  </div>
                  {/* Chat */}
                  <div className="flex items-end text-[#3CA9F9] space-x-1">
                    <FontAwesomeIcon icon={faComment} className="w-6 h-6" />
                    <span>{commentCount}</span>
                  </div>

                  {/* Save */}
                  <div className="flex items-end text-gray-500 space-x-1">
                    <button
                      onClick={handleSaveClick}
                      className="focus:outline-none"
                    >
                      <FontAwesomeIcon
                        icon={faBookmark}
                        className={`w-6 h-6 transition duration-100 ${
                          isSaved ? "text-yellow-400" : "text-gray-500"
                        }`}
                      />
                    </button>
                    <span>{savesCount}</span>
                  </div>
                </div>
              </div>

              <BasicInformation
                price={post.price}
                area={post.area}
                orientation={post.orientation}
                bedroom={post.bedroom}
                bathroom={post.bathroom}
                floor={post.floor}
                legal_status={post.legal_status}
                frontage={post.frontage}
                address={post.address}
                ward={post.ward}
                district={post.district}
                city={post.city}
                description={post.description}
                longitude={post.longitude}
                latitude={post.latitude}
                land_lot={post.land_lot} // Lô đất
                land_parcel={post.land_parcel} // Thửa đất
                map_sheet_number={post.map_sheet_number} // Tờ bản đồ
                length={post.length}
                width={post.width}
              />
              {/* Image */}
              {id === post.user.user_id && (
                <ImageCard type="detail" postId={postId} auth="owner" />
              )}
              {id !== post.user.user_id && (
                <ImageCard type="detail" postId={postId} auth="user" />
              )}
              <DetailDescription
                description={post.description}
                maxLength={5000000}
              />
            </>
          ) : (
            <div className="text-center text-gray-500">
              Đang tải bài đăng...
            </div>
          )}
        </div>
        <div className="flex flex-col">
          {/* Comment */}
          <Comment post_id={postId} sessionToken={sessionToken} />

          {/* Neogotiation */}
          {post && post.user.user_id === id ? (
            <>
              <NegotiationList type="owner" />
              <MapView longitude={post?.longitude} latitude={post?.latitude} />
            </>
          ) : (
            <>
              <NegotiationList />
              <MapView longitude={post?.longitude} latitude={post?.latitude} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPost;
