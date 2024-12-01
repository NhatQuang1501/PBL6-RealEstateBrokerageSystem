import DashboardAdmin from "../DashboardAdmin/DashboardAdmin";
import ReportList from "../ManageReport/ReportList";
import ManagerUserAccount from "../ManagerUserAccount/ManagerUserAccount";
import ListPosts from "../ManagerUserPost/ListPost";
import WaitingForApproval from "../ManagerUserPost/waitingForApproval";

const AdminBody = ({ isCollapsed, activeMenu }) => {
  return (
    <div
      className={`absolute top-[6rem] right-2 h-[85vh] transition-width duration-300  ${
        isCollapsed ? "w-[92vw]" : "w-[76vw]"
      } `}
    >
      {activeMenu === "dashboard" && <DashboardAdmin />}
      {activeMenu === "accountList" && <ManagerUserAccount />}
      {activeMenu === "managePosts" && <ListPosts />}
      {activeMenu === "browsePosts" && <WaitingForApproval />}
      {activeMenu === "manageReports" && <ReportList />}
    </div>
  );
};

export default AdminBody;
