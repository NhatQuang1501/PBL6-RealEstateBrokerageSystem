import DashboardAdmin from "../DashboardAdmin/DashboardAdmin";
import ManagerUserAccount from "../ManagerUserAccount/ManagerUserAccount";
import ListPosts from "../ManagerUserPost/ListPost";

const AdminBody = ({ isCollapsed, activeMenu }) => {
  return (
    <div
      className={`absolute top-28 right-2 h-[84vh] transition-width duration-300  ${
        isCollapsed ? "w-[92vw]" : "w-[76vw]"
      } `}
    >
      {activeMenu === "dashboard" && <DashboardAdmin />}
      {activeMenu === "accountList" && <ManagerUserAccount/>}
      {activeMenu === "managePosts" && <ListPosts/>}
      {activeMenu === "browsePosts" && <div>Duyệt bài đăng</div>}
      {activeMenu === "creatPost" && <div>Tạo bài đăng</div>}

    </div>
  );
};

export default AdminBody;
