"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Settings, Search, Share2, User, LogOut, File } from "lucide-react";
import { getThemeClasses, useTheme } from "./Theme";
import PDFUploader from "./PdfUploader";
import { useRouter } from "next/navigation";

interface Document {
  id: number;
  title: string;
  date: string;
  imageId: "1" | "2";
}

const MIN_SIDEBAR_WIDTH = 256; // 16rem
const MAX_SIDEBAR_WIDTH = 800; // 50rem

const RightSidebar = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");

  const themeClasses = getThemeClasses(theme);

  // Handle mouse move event for resizing
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - event.clientX;
      if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
        setSidebarWidth(newWidth);
      }
    },
    [isResizing]
  );

  // Handle mouse up event to stop resizing
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add and remove event listeners for dragging
  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const themeHoverClasses = {
    light: {
      hover: "hover:bg-gray-200",
      text: "text-black",
      icon: "text-gray-600",
      sidebarText: "text-gray-700",
      loadingBg: "bg-gray-100",
    },
    dark: {
      hover: "hover:bg-gray-800",
      text: "text-white",
      icon: "text-gray-300",
      sidebarText: "text-gray-300",
      loadingBg: "bg-gray-800",
    },
    ocean: {
      hover: "hover:bg-blue-900/50",
      text: "text-blue-100",
      icon: "text-blue-200",
      sidebarText: "text-blue-200",
      loadingBg: "bg-blue-900/20",
    },
    forest: {
      hover: "hover:bg-green-900/50",
      text: "text-green-100",
      icon: "text-green-200",
      sidebarText: "text-green-200",
      loadingBg: "bg-green-900/20",
    },
    sunset: {
      hover: "hover:bg-orange-900/50",
      text: "text-orange-100",
      icon: "text-orange-200",
      sidebarText: "text-orange-200",
      loadingBg: "bg-orange-900/20",
    },
  };

  const currentThemeClasses =
    themeHoverClasses[theme] || themeHoverClasses.dark;

  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  useEffect(() => {
    fetchUsername();
    fetchFiles();
  }, []);

  const fetchUsername = async () => {
    try {
      const response = await fetch("http://localhost:8080/userName", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch username");
      }

      const data = await response.text();
      setUsername(data);
    } catch (err: unknown) {
      console.error("Error fetching username:", err);
    }
  };

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:8080/files", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }

      const data = await response.json();
      setFiles(data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch files";
      setError(errorMessage);
      console.error("Error fetching files:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const renderDocuments = (docs: Document[]) => {
    return docs.map((doc) => (
      <div
        key={doc.id}
        className={`px-4 py-3 ${currentThemeClasses.hover} ${currentThemeClasses.text} rounded cursor-pointer flex items-center gap-3`}
      >
        <div className="w-6 h-6 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
          <img
            src={`/${doc.imageId}.png`}
            alt={doc.title}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm truncate">{doc.title}</span>
      </div>
    ));
  };

  return (
    <>
      {/* Drag handle */}
      <div
        className={`fixed right-0 top-0 bottom-0 cursor-ew-resize
          ${isResizing ? "bg-gray-800" : "bg-gray-800"}
          transition-colors duration-200`}
        style={{
          right: `${sidebarWidth}px`,
          cursor: "ew-resize",
          width: "1px",
          backgroundColor: "rgb(31 41 55)",
        }}
        onMouseDown={() => setIsResizing(true)}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 min-h-screen ${themeClasses.background} ${currentThemeClasses.text} overflow-hidden flex flex-col`}
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <Settings className={`w-6 h-6 ${currentThemeClasses.icon}`} />
            <div className="flex gap-4">
              <Share2 className={`w-6 h-6 ${currentThemeClasses.icon}`} />
            </div>
          </div>

          <nav className="space-y-4">
            <div
              className={`flex items-center gap-3 px-4 py-3 ${currentThemeClasses.hover} rounded cursor-pointer`}
            >
              <User className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{username || "Guest User"}</span>
            </div>

            {/* <div className="mt-4 px-3 py-2">
              <PDFUploader />
            </div> */}

            {/* Files Section */}
            <div className="mt-6">
              <h3
                className={`px-4 text-xs font-medium ${currentThemeClasses.sidebarText} mb-2`}
              >
                Your Files
              </h3>
              <div className="space-y-1">
                {loading ? (
                  <div
                    className={`px-4 py-3 ${currentThemeClasses.loadingBg} rounded`}
                  >
                    Loading files...
                  </div>
                ) : error ? (
                  <div className="px-4 py-3 text-red-500 text-sm">{error}</div>
                ) : files.length === 0 ? (
                  <div
                    className={`px-4 py-3 ${currentThemeClasses.text} text-sm`}
                  >
                    No files found
                  </div>
                ) : (
                  files.map((fileName, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`w-full px-4 py-3 ${currentThemeClasses.hover} ${currentThemeClasses.text} rounded cursor-pointer flex items-center gap-3 text-left`}
                    >
                      <File
                        className={`w-5 h-5 ${currentThemeClasses.icon} flex-shrink-0`}
                      />
                      <span className="text-sm truncate">{fileName}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full px-4 py-3 ${currentThemeClasses.hover} ${currentThemeClasses.text} rounded cursor-pointer flex items-center gap-3`}
          >
            <LogOut className={`w-5 h-5 ${currentThemeClasses.icon}`} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
