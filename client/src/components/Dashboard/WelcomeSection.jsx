import React from "react";

const WelcomeSection = ({ user, setActiveTab }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  return (
    <section
      className="relative overflow-hidden rounded-2xl p-8 mb-6 cursor-pointer hover:opacity-90 transition"
      style={{ background: "var(--gradient-bg)" }}
      onClick={() => setActiveTab("profile")}
    >
      <div className="relative z-10 flex items-center gap-6 flex-wrap">
        <div className="w-20 h-20 rounded-full border-4 border-white shadow bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
          {user?.fullname?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="text-[var(--text-on-primary)]">
          <h1 className="text-2xl font-bold">{getGreeting()}, {user?.fullname || "User"}!</h1>
          <p className="opacity-90">{user?.email}</p>
          <p className="opacity-70 text-sm">@{user?.username}</p>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
