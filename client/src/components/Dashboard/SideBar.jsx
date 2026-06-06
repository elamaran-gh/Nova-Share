import React from "react";
import { MdHome, MdUpload, MdSettings, MdLogout } from "react-icons/md";
const Sidebar = ({ sidebarOpen, setSidebarOpen, setActiveTab, activeTab }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };
  const tabs = [
    { name: "Home", icon: <MdHome size={20} />, id: "home" },
    { name: "Upload Files", icon: <MdUpload size={20} />, id: "upload" },
    { name: "Settings", icon: <MdSettings size={20} />, id: "settings" },
    { name: "Logout", icon: <MdLogout size={20} />, id: "logout" },
  ];
  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-200 ease-in-out w-64 z-40 md:translate-x-0 md:static md:inset-0 bg-[var(--bg-color)] text-[var(--text-color)] shadow-[2px_0_8px_rgba(0,0,0,0.08)] py-20`}
    >
      <div className="flex flex-col mt-4 h-full">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-left w-full font-medium transition ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
export default Sidebar;
