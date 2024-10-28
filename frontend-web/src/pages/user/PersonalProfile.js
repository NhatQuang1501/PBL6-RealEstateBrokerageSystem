import Portfolio from "../../components/personal_profile/Portfolio";
import ProfileCard from "../../components/personal_profile/ProfileCard";
import SideProjects from "../../components/personal_profile/SideProjects";

const PersonalProfile = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 font-montserrat">
      <div className="grid grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="col-span-1">
          <ProfileCard />
        </div>

        {/* Main Content */}
        <div className="col-span-3 grid grid-cols-2 gap-6">
          {/* Portfolio */}
          <div>
            <Portfolio />
          </div>

          {/* Side Projects */}
          <div>
            <SideProjects />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalProfile;
