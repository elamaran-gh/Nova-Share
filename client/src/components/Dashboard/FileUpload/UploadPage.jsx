import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../../../redux/slice/file/fileThunk";
import { toast } from "react-toastify";
import { MdUploadFile, MdInsertDriveFile, MdVideoFile, MdImage, MdClose, MdCloudUpload, MdLock, MdSchedule, MdFolderOpen } from "react-icons/md";

const FileUploader = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.file);
  const { user } = useSelector((state) => state.auth);

  const [files, setFiles] = useState([]);
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [enableExpiry, setEnableExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleBrowseClick = () => fileInputRef.current.click();

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).filter((f) => f.size <= 10 * 1024 * 1024);
    setFiles((prev) => [...prev, ...newFiles]);
    toast.success("File(s) added!");
  };

  const handleFileInputChange = (e) => handleFiles(e.target.files);
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); };
  const removeFile = (index) => { setFiles((prev) => prev.filter((_, i) => i !== index)); toast.info("File removed"); };
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  const handleUpload = async () => {
    if (files.length === 0) { toast.error("Please upload at least one file."); return; }
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("userId", user._id ? user._id : user.id);
    formData.append("hasExpiry", enableExpiry);
    if (enableExpiry && expiryDate) {
      const hours = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60));
      formData.append("expiresAt", hours);
    }
    formData.append("isPassword", enablePassword);
    if (enablePassword && password) formData.append("password", password);
    try {
      await dispatch(uploadFile(formData)).unwrap();
      toast.success("Files uploaded successfully!");
      setFiles([]);
      window.location.reload();
    } catch (err) {
      toast.error(err?.error || "Upload failed");
    }
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith("image")) return <MdImage size={28} className="text-blue-500" />;
    if (file.type.startsWith("video")) return <MdVideoFile size={28} className="text-purple-500" />;
    return <MdInsertDriveFile size={28} className="text-indigo-500" />;
  };

  const Toggle = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-10 h-5 bg-gray-300 peer-checked:bg-blue-600 rounded-full relative transition-colors">
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : ""}`} />
      </div>
    </label>
  );

  return (
    <div className="w-full min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-[var(--bg-color)] text-[var(--text-color)]">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--primary-text)]">File Upload</h1>
          <p className="text-xs sm:text-sm opacity-50 mt-1">Drag & drop files or tap to browse</p>
        </div>

        {/* Drop Zone */}
        <div
          onClick={handleBrowseClick}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
            dragOver ? "border-blue-500 bg-blue-50" : "border-[var(--border-color)] hover:border-blue-400 active:border-blue-500"
          }`}
        >
          <MdFolderOpen size={52} className="mx-auto mb-3 text-yellow-400" />
          <p className="text-sm sm:text-base font-semibold">Drop files here</p>
          <p className="text-xs opacity-40 mt-1 mb-5 px-4">JPG, PNG, PDF, MP4, MOV, AVI, MKV · Max 10MB each</p>
          <button
            onClick={(e) => { e.stopPropagation(); handleBrowseClick(); }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-lg transition touch-manipulation"
          >
            Browse Files
          </button>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept=".jpg,.jpeg,.webp,.png,.mp4,.avi,.mov,.mkv,.mk3d,.mks,.mka,.pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* Options */}
        <div className="bg-[var(--bg-color)] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] p-4 space-y-5">

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MdLock size={18} className="text-[var(--primary-text)] flex-shrink-0" />
                <span className="text-sm font-medium">Set Password</span>
              </div>
              <Toggle checked={enablePassword} onChange={(e) => setEnablePassword(e.target.checked)} />
            </div>
            {enablePassword && (
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.08)] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          <div className="h-px bg-[var(--border-color)] opacity-40" />

          {/* Expiry */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MdSchedule size={18} className="text-[var(--primary-text)] flex-shrink-0" />
                <span className="text-sm font-medium">Set Expiry Date</span>
              </div>
              <Toggle checked={enableExpiry} onChange={(e) => setEnableExpiry(e.target.checked)} />
            </div>
            {enableExpiry && (
              <input
                type="datetime-local"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.08)] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </div>

        {/* Upload Summary */}
        {files.length > 0 && (
          <div className="bg-[var(--bg-color)] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] p-4">
            <p className="text-sm font-semibold mb-3">Upload Summary</p>
            <div className="flex justify-around mb-3">
              <div className="text-center">
                <p className="text-xl font-bold text-blue-600">{files.length}</p>
                <p className="text-xs opacity-50">Files</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-blue-600">
                  {totalSize > 1024 * 1024 ? `${(totalSize / (1024 * 1024)).toFixed(2)} MB` : `${(totalSize / 1024).toFixed(2)} KB`}
                </p>
                <p className="text-xs opacity-50">Total Size</p>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${Math.min((totalSize / (10 * 1024 * 1024)) * 100, 100)}%` }} />
            </div>
          </div>
        )}

        {/* File List */}
        {files.length === 0 ? (
          <div className="text-center py-6 opacity-30">
            <MdUploadFile size={40} className="mx-auto mb-2" />
            <p className="text-sm italic">No files selected yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-[var(--bg-color)] rounded-xl shadow-[0_1px_6px_rgba(0,0,0,0.07)]">
                {/* Thumbnail */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {file.type.startsWith("image") ? (
                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                  ) : file.type.startsWith("video") ? (
                    <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" muted />
                  ) : (
                    getFileIcon(file)
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs opacity-40 mt-0.5">
                    {file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${(file.size / 1024).toFixed(2)} KB`}
                  </p>
                </div>
                {/* Remove */}
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-500 rounded-lg transition touch-manipulation flex-shrink-0"
                >
                  <MdClose size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <div className="flex justify-center pb-4">
          <button
            onClick={handleUpload}
            disabled={loading || files.length === 0}
            className="flex items-center gap-2 w-full sm:w-auto px-8 py-3 justify-center bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition shadow-md touch-manipulation"
          >
            <MdCloudUpload size={20} />
            {loading ? "Uploading..." : "Upload Files"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default FileUploader;