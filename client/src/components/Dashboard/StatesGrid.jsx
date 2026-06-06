import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/slice/auth/authThunk";

const StatsGrid = () => {
  const dispatch = useDispatch();
  const rawUser = useSelector((state) => state.auth.user);
  const user = rawUser?.user || rawUser;
  const hasFetched = useRef(false);

  useEffect(() => {
    if (user && user.id && !hasFetched.current) {
      dispatch(getUser(user.id));
      hasFetched.current = true;
    }
  }, [user, dispatch]);

  const cards = [
    { title: "Total Uploads", value: user?.totalUploads ?? 0 },
    { title: "Total Downloads", value: user?.totalDownloads ?? 0 },
    { title: "Videos Uploaded", value: user?.videoCount ?? 0 },
    { title: "Images Uploaded", value: user?.imageCount ?? 0 },
    { title: "Documents Uploaded", value: user?.documentCount ?? 0 },
    {
      title: "Last Login",
      value: user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="relative p-5 rounded-xl bg-[var(--bg-color)] shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition hover:shadow-md"
        >
          <div className="absolute top-0 left-0 w-full h-1 rounded-t-xl bg-[var(--primary-gradient)]" />
          <div className="text-center">
            <p className="text-2xl font-semibold text-[var(--primary-text)]">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
