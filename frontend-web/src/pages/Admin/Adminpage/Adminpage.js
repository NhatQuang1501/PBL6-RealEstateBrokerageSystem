import React, { useState } from "react";
import Navbar from "../NavbarAdmin/NavbarAdmin";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import AdminBody from "../AdminBody/AdminBody";


const Adminpage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu,setActiveMenu] = useState("dashboard");
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="relative bg-[#9EBBD8] p-3 transition-width duration-300 font-montserrat">
      <Navbar isCollapsed={isCollapsed} activeMenu={activeMenu} toggleNavbar={toggleNavbar} handleMenuClick={handleMenuClick}/>
      <HeaderAdmin isCollapsed={isCollapsed}/>
      <AdminBody isCollapsed={isCollapsed} activeMenu={activeMenu}/>
    </div>
  );
};

export default Adminpage;
