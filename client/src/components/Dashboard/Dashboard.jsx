import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import Sidebar from "./SideBar";
import StatsGrid from "./StatesGrid";
import WelcomeSection from "./WelcomeSection";
import UserProfile from "./UserProfile";
import UploadPage from "./FileUpload/UploadPage";
import FileShow from "./FileShow";
import Logout from "./Logout";
import AIAssistant from "./AIAssistant";
import Footer from "../Footer";

const Dashboard = () => {
  const { user: rawUser } = useSelector((state) => state.auth);
  const user = rawUser?.user || rawUser;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <h1 className="text-3xl font-bold text-gray-700 animate-pulse">Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex bg-[var(--bg-color)]">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setActiveTab={setActiveTab} activeTab={activeTab} />
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <div className="flex flex-col flex-1">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 p-6 mt-20">
            {activeTab === "upload" && <UploadPage />}
            {activeTab === "profile" && <UserProfile />}
            {activeTab === "logout" && <Logout />}
            {activeTab === "home" && (
              <>
                <WelcomeSection user={user} setActiveTab={setActiveTab} />
                <StatsGrid />
                <FileShow />
                <AIAssistant />
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;


