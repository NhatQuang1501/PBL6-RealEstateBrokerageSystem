import DashboardAdmin from "../DashboardAdmin/DashboardAdmin";
import ManagerUserAccount from "../ManagerUserAccount/ManagerUserAccount";
import ListPosts from "../ManagerUserPost/ListPost";
import WaitingForApproval from "../ManagerUserPost/waitingForApproval";

const AdminBody = ({ isCollapsed, activeMenu }) => {
  return (
    <div
      className={`absolute top-28 right-2 h-[84vh] transition-width duration-300  ${
        isCollapsed ? "w-[92vw]" : "w-[76vw]"
      } `}
    >
      {activeMenu === "dashboard" && <DashboardAdmin />}
      {activeMenu === "accountList" && <ManagerUserAccount/>}
      {activeMenu === "managePosts" && (

      <ListPosts />

  )}
      {activeMenu === "browsePosts" && 
        <WaitingForApproval/>}
      {activeMenu === "creatPost" && <div>Tạo bài đăng</div>}

    </div>
  );
};

export default AdminBody;
