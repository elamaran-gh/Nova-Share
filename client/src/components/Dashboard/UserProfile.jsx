import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteUser, updateUser } from "../../redux/slice/auth/authThunk";
import { MdEdit, MdDelete, MdPerson, MdEmail, MdBadge, MdClose } from "react-icons/md";

const UserProfile = () => {
  const { user: rawUser } = useSelector((state) => state.auth);
  const user = rawUser?.user || rawUser;
  const dispatch = useDispatch();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");

  const handleUpdate = () => {
    dispatch(updateUser({ userId: user?._id || user?.id, username: newUsername }));
    setEditModalOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteUser(user?._id || user?.id));
    setDeleteModalOpen(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-[var(--text-color)] opacity-50">
        <p>No user data found. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-[var(--bg-color)] text-[var(--text-color)]">
      <div className="max-w-2xl mx-auto space-y-5">

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--primary-text)]">User Profile</h1>
          <p className="text-xs sm:text-sm opacity-50 mt-1">Manage your account details</p>
        </div>

        <div className="bg-[var(--bg-color)] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="flex-shrink-0">
              {user.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-md ring-4 ring-[var(--primary-text)] ring-opacity-30" />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-md ring-4 ring-blue-200">
                  <span className="text-3xl font-bold text-white">{user.fullname?.charAt(0).toUpperCase() || "U"}</span>
                </div>
              )}
            </div>

            <div className="flex-1 w-full space-y-3 text-center sm:text-left">
              <h2 className="text-lg font-bold text-[var(--primary-text)]">{user.fullname || "—"}</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm opacity-70">
                  <MdPerson size={16} className="flex-shrink-0 text-[var(--primary-text)]" />
                  <span>@{user.username || "—"}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm opacity-70">
                  <MdEmail size={16} className="flex-shrink-0 text-[var(--primary-text)]" />
                  <span className="truncate">{user.email || "—"}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm opacity-50">
                  <MdBadge size={16} className="flex-shrink-0 text-[var(--primary-text)]" />
                  <span className="text-xs truncate">{user._id || user.id || "—"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl shadow-md transition touch-manipulation"
          >
            <MdEdit size={18} />
            Edit Profile
          </button>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold rounded-xl shadow-md transition touch-manipulation"
          >
            <MdDelete size={18} />
            Delete Account
          </button>
        </div>
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-[var(--bg-color)] text-[var(--text-color)] w-full max-w-sm rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--primary-text)]">Update Username</h3>
              <button onClick={() => setEditModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
                <MdClose size={18} />
              </button>
            </div>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.08)] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new username"
            />
            <div className="flex gap-3 pt-1">
              <button onClick={() => setEditModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium text-sm transition">
                Cancel
              </button>
              <button onClick={handleUpdate} className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition">
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-[var(--bg-color)] text-[var(--text-color)] w-full max-w-sm rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-red-500">Delete Account</h3>
              <button onClick={() => setDeleteModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
                <MdClose size={18} />
              </button>
            </div>
            <p className="text-sm opacity-60">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium text-sm transition">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm shadow-md transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
