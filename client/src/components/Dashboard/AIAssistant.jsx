import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { aiSearch, aiSummarize } from "../../redux/slice/file/fileThunk";
import { clearAiSummary, clearAiResults } from "../../redux/slice/file/fileSlice";
import { MdAutoAwesome, MdSearch, MdSummarize, MdClose } from "react-icons/md";

const AIAssistant = () => {
  const dispatch = useDispatch();
  const { files, aiResults, aiSummary, loading } = useSelector((state) => state.file);
  const [query, setQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState("search");

  const handleAISearch = async () => {
    if (!query.trim()) return;
    dispatch(clearAiResults());
    await dispatch(aiSearch({ query, files }));
  };

  const handleSummarize = async (file) => {
    setSelectedFile(file);
    dispatch(clearAiSummary());
    await dispatch(aiSummarize(file));
  };

  return (
    <div className="mt-6 p-5 rounded-xl bg-[var(--bg-color)] shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <MdAutoAwesome className="text-purple-500 text-2xl" />
        <h2 className="text-lg font-bold text-[var(--primary-text)]">AI Assistant</h2>
        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">Powered by Gemini</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("search")}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "search" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <MdSearch /> Smart Search
        </button>
        <button
          onClick={() => setActiveTab("summarize")}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "summarize" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <MdSummarize /> Summarize
        </button>
      </div>

      {/* Smart Search Tab */}
      {activeTab === "search" && (
        <div>
          <p className="text-xs text-gray-400 mb-2">Try: "show me pdfs", "files expiring soon", "images uploaded this week"</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAISearch()}
              placeholder="Ask AI to find your files..."
              className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={handleAISearch}
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {/* AI Search Results */}
          {aiResults?.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2 text-gray-600">AI found {aiResults.length} file(s):</p>
              <div className="space-y-2">
                {aiResults.map((file) => (
                  <div key={file._id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-400">{file.type} · {file.status}</p>
                    </div>
                    <button
                      onClick={() => { setActiveTab("summarize"); handleSummarize(file); }}
                      className="text-xs text-purple-600 underline"
                    >
                      Summarize
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {aiResults?.length === 0 && query && !loading && (
            <p className="mt-3 text-sm text-gray-400">No files matched your query.</p>
          )}
        </div>
      )}

      {/* Summarize Tab */}
      {activeTab === "summarize" && (
        <div>
          <p className="text-xs text-gray-400 mb-3">Select a file to get an AI summary:</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files?.map((file) => (
              <div
                key={file._id}
                onClick={() => handleSummarize(file)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                  selectedFile?._id === file._id ? "border-purple-400 bg-purple-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div>
                  <p className="text-sm font-medium">{file.name.length > 30 ? file.name.slice(0, 30) + "..." : file.name}</p>
                  <p className="text-xs text-gray-400">{file.type}</p>
                </div>
                <span className="text-xs text-purple-600 font-medium">? Summarize</span>
              </div>
            ))}
          </div>

          {/* Summary Result */}
          {loading && <p className="mt-4 text-sm text-purple-500 animate-pulse">Generating summary...</p>}
          {aiSummary && !loading && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg relative">
              <button
                onClick={() => dispatch(clearAiSummary())}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <MdClose />
              </button>
              <p className="text-xs font-semibold text-purple-600 mb-1">? AI Summary for: {selectedFile?.name}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{aiSummary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
