import { useEffect } from "react";
import Portfolio from "../../components/personal_profile/Portfolio";
import ProfileCard from "../../components/personal_profile/ProfileCard";
import { useAppContext } from "../../AppProvider";
import Logo from "../../assets/image/Logo.png";
import { useNavigate } from "react-router-dom";

const PersonalProfile = () => {
  const { role } = useAppContext();
  let navigate = useNavigate();
  useEffect(() => {
    // window.location.reload();
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen text-white p-3 font-montserrat">
      <div className="grid grid-cols-8 gap-1">
        {role === "user" ? (
          <div className="col-span-2 sticky top-[6rem] self-start">
            <ProfileCard />
          </div>
        ) : (
          <div className="col-span-2 sticky top-[1rem] self-start">
            <div className="flex flex-col gap-[3rem] cursor-pointer">
              <div
                className="flex items-center w-auto gap-3"
                onClick={() => navigate("/admin/dashboard")}
              >
                <img
                  className="h-13 w-13 object-contain"
                  src={Logo}
                  alt="Logo"
                />
                <strong className="flex flex-col justify-between h-8 text-black">
                  <p className="font-bold">Admin</p>
                  <p className="font-bold">SweetHome</p>
                </strong>
              </div>
              <ProfileCard />
            </div>
          </div>
        )}

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
