import { useEffect } from "react";
import Portfolio from "../../components/personal_profile/Portfolio";
import ProfileCard from "../../components/personal_profile/ProfileCard";
// import SideProjects from "../../components/personal_profile/SideProjects";

const PersonalProfile = () => {
  useEffect(() => {
    // window.location.reload();
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen text-white p-3 font-montserrat">
      <div className="grid grid-cols-8 gap-1">
        {/* Profile Card */}
        <div className="col-span-2 sticky top-[6rem] self-start">
          <ProfileCard />
        </div>

        {/* Main Content */}
        <div className="col-span-6">
          {/* Portfolio */}
          <div className="flex-1">
            <Portfolio />
          </div>

          {/* Side Projects */}
          {/* <div
            className="flex-1 sticky top-[6rem] self-start"
            style={{ flex: "0 0 20%" }}
          >
            <SideProjects />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PersonalProfile;
