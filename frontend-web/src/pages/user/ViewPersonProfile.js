import Portfolio from "../../components/personal_profile/Portfolio";
import ProfileCard from "../../components/personal_profile/ProfileCard";
import SideProjects from "../../components/personal_profile/SideProjects";

const ViewPersonProfile = () => {
  return (
    <div className="min-h-screen bg-white text-white p-10 font-montserrat">
      <div className="grid grid-cols-8 gap-5">
        {/* Profile Card */}
        <div className="col-span-2 sticky top-[6rem] self-start">
          <ProfileCard />
        </div>

        {/* Main Content */}
        <div className="col-span-6 flex gap-6">
          {/* Portfolio */}
          <div className="flex-1" style={{ flex: "0 0 70%" }}>
            <Portfolio />
          </div>

          {/* Side Projects */}
          <div
            className="flex-1 sticky top-[6rem] self-start"
            style={{ flex: "0 0 20%" }}
          >
            <SideProjects />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPersonProfile;
