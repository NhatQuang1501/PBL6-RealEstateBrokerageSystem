import Panel from "../../components/panel/Panel";
import Post from "../../components/item_post/Post";
import Pagination from "../../components/pagination/pagination";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt, faEdit, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../../AppProvider";
import { useNavigate } from "react-router-dom";

const MainPageUser = ({
  searchValue,
  filterStatusValue,
  filterPriceValue,
  filterAreaValue,
  typePost,
}) => {
  const [filterLegalValue, setFilterLegalValue] = useState([]);
  const [filterOrientationValue, setFilterOrientationValue] = useState([]);
  const [filterBedroomValue, setFilterBedroomValue] = useState([]);
  const [filterBathroomValue, setFilterBathroomValue] = useState([]);
  const [filterDistrictValue, setFilterDistrictValue] = useState([]);

  const [sortOption, setSortOption] = useState("Mới nhất");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const savedPage = localStorage.getItem("currentPage");
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, []);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(posts.length / itemsPerPage);

  const currentPosts = posts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const { sessionToken } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      let url;
      if (searchValue) {
        url = searchValue
          ? `http://127.0.0.1:8000/api/search/?text=${encodeURIComponent(
              searchValue
            )}`
          : "http://127.0.0.1:8000/api/posts/";
      } else if (typePost) {
        if (typePost === "house") {
          url = "http://127.0.0.1:8000/api/posts/?category=house";
        } else if (typePost === "land") {
          url = "http://127.0.0.1:8000/api/posts/?category=land";
        }
      } else {
        if (sortOption === "Mới nhất") {
          url = "http://127.0.0.1:8000/api/posts/";
        } else if (sortOption === "Cũ nhất") {
          url = `http://127.0.0.1:8000/api/posts/?category=oldest posts`;
        } else if (sortOption === "Nổi bật") {
          url = `http://127.0.0.1:8000/api/posts/?category=popular`;
        } else if (sortOption === "Đề xuất") {
          url = `http://127.0.0.1:8000/api/posts-recommendation/?num_recommendations=10`;
        }
      }
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        });

        const data = await response.json();
        console.log("Post data:", data);
        console.log("Sort option:", sortOption);
        console.log("URL:", url);

        let sortedPosts = Array.isArray(data) ? data : [];

        // Lọc các bài đăng dựa trên filterValue
        if (filterStatusValue) {
          sortedPosts = sortedPosts.filter(
            (post) => post.sale_status === filterStatusValue
          );
        }
        // Lọc các bài đăng dựa trên filterPriceValue
        if (filterPriceValue) {
          sortedPosts = sortedPosts.filter((post) => {
            const price = parseInt(post.price, 10);
            switch (filterPriceValue) {
              case "<=500":
                return price <= 500000000;
              case "500-1000":
                return price >= 500000000 && price <= 1000000000;
              case "1000-3000":
                return price >= 1000000000 && price <= 3000000000;
              case "3000-5000":
                return price >= 3000000000 && price <= 5000000000;
              case "5000-7000":
                return price >= 5000000000 && price <= 7000000000;
              case "7000-9000":
                return price >= 7000000000 && price <= 9000000000;
              case "9000-10000":
                return price >= 9000000000 && price <= 10000000000;
              case ">=10000":
                return price >= 10000000000;
              default:
                return true;
            }
          });
        }

        // Lọc các bài đăng dựa trên filterAreaValue
        if (filterAreaValue) {
          sortedPosts = sortedPosts.filter((post) => {
            const area = parseInt(post.area, 10);
            switch (filterAreaValue) {
              case "<=50":
                return area <= 50;
              case "50-100":
                return area >= 50 && area <= 100;
              case "100-200":
                return area >= 100 && area <= 200;
              case "200-300":
                return area >= 200 && area <= 300;
              case "300-500":
                return area >= 300 && area <= 500;
              case "500-700":
                return area >= 500 && area <= 700;
              case "700-1000":
                return area >= 700 && area <= 1000;
              case ">=1000":
                return area >= 1000;
              default:
                return true;
            }
          });
        }

        // Lọc các bài đăng dựa trên filterLegalValue
        if (filterLegalValue.length > 0) {
          sortedPosts = sortedPosts.filter((post) =>
            filterLegalValue.includes(post.legal_status)
          );
        }

        // Lọc các bài đăng dựa trên filterOrientationValue
        if (filterOrientationValue.length > 0) {
          sortedPosts = sortedPosts.filter((post) =>
            filterOrientationValue.includes(post.orientation)
          );
        }

        // Lọc các bài đăng dựa trên filterBedroomValue
        if (filterBedroomValue.length > 0) {
          sortedPosts = sortedPosts.filter((post) => {
            const bedroom = parseInt(post.bedroom, 10);
            return filterBedroomValue.some((value) => {
              if (value === "Nhiều hơn 5") {
                return bedroom > 5;
              }
              return bedroom === parseInt(value, 10);
            });
          });
        }

        // Lọc các bài đăng dựa trên filterBathroomValue
        if (filterBathroomValue.length > 0) {
          sortedPosts = sortedPosts.filter((post) => {
            const bathroom = parseInt(post.bathroom, 10);
            return filterBathroomValue.some((value) => {
              if (value === "Nhiều hơn 5") {
                return bathroom > 5;
              }
              return bathroom === parseInt(value, 10);
            });
          });
        }

        // Lọc các bài đăng dựa trên filterDistrictValue
        if (filterDistrictValue.length > 0) {
          sortedPosts = sortedPosts.filter((post) =>
            filterDistrictValue.includes(post.district)
          );
        }

        // Sắp xếp các bài đăng dựa trên sortOption
        if (sortOption === "Mới nhất") {
          sortedPosts = sortedPosts.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
        } else if (sortOption === "Cũ nhất") {
          sortedPosts = sortedPosts.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );
        }

        setPosts(sortedPosts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [
    searchValue,
    filterStatusValue,
    filterPriceValue,
    filterAreaValue,
    filterLegalValue,
    filterOrientationValue,
    filterBedroomValue,
    filterBathroomValue,
    filterDistrictValue,
    sortOption,
    typePost,
    sessionToken,
  ]);

  const handleCreatePostClick = () => {
    if (!sessionToken) {
      navigate("authen/login");
      return;
    } else {
      navigate("/user/create-post");
    }
  };

  const handleSortOptionClick = (option) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  };

  return (
    <div className="font-montserrat main-content">
      <div className="flex items-center justify-between w-[72%] ml-5 mt-6 mb-4 px-6 py-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-lg">
        {!searchValue ? (
          <h3 className="text-2xl font-bold text-black flex items-center gap-3">
            <FontAwesomeIcon
              icon={faListAlt}
              className="text-black bg-white p-3 w-8 h-8 rounded-full shadow-md"
            />
            Danh sách bài đăng
          </h3>
        ) : (
          <h3 className="text-2xl font-bold text-black flex items-center gap-3">
            <FontAwesomeIcon
              icon={faListAlt}
              className="text-black bg-white p-3 w-8 h-8 rounded-full shadow-md"
            />
            Đã tìm kiếm theo "<span className="italic">{searchValue}</span>"
          </h3>
        )}
        <div className="relative">
          <div
            className="text-black bg-white p-2 rounded-2xl font-semibold underline hover:text-gray-600 transition-colors duration-200 cursor-pointer border-[2px] border-solid border-gray-300"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Sắp xếp theo
            <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
          </div>
          {isDropdownOpen && (
            <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <ul className="py-1 font-semibold">
                <li
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer"
                  onClick={() => handleSortOptionClick("Mới nhất")}
                >
                  Mới nhất
                </li>
                <li
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer"
                  onClick={() => handleSortOptionClick("Cũ nhất")}
                >
                  Cũ nhất
                </li>
                <li
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer"
                  onClick={() => handleSortOptionClick("Nổi bật")}
                >
                  Nổi bật
                </li>
                <li
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer"
                  onClick={() => handleSortOptionClick("Đề xuất")}
                >
                  Đề xuất với bạn
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <Panel
        className="flex flex-col max-h-full"
        setFilterLegalValue={setFilterLegalValue}
        setFilterOrientationValue={setFilterOrientationValue}
        setFilterBedroomValue={setFilterBedroomValue}
        setFilterBathroomValue={setFilterBathroomValue}
        setFilterDistrictValue={setFilterDistrictValue}
      >
        <div className="relative h-full overflow-y-auto grid grid-cols-1 gap-4">
          {currentPosts.map((post, index) => (
            <div
              key={index}
              className="border-[3px] rounded-[1rem] border-[#002182] shadow-md bg-white"
            >
              <Post post={post} />
            </div>
          ))}
        </div>

        {posts.length > 0 ? (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div className="text-center font-bold">Không có bài đăng nào</div>
        )}
      </Panel>
      <div
        onClick={handleCreatePostClick}
        className="fixed bottom-4 right-4 bg-gray-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-[#005bb5] transition duration-300 cursor-pointer"
        style={{ zIndex: 1000 }}
        title="Tạo bài đăng"
      >
        <FontAwesomeIcon icon={faEdit} className="w-5 h-5" />
      </div>
    </div>
  );
};

export default MainPageUser;
