/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Settings, Search, Share2, Grid } from "lucide-react";
import { getThemeClasses, useTheme } from "./Theme";

const MIN_SIDEBAR_WIDTH = 180; // Minimum width for left sidebar
const MAX_SIDEBAR_WIDTH = 400; // Maximum width for left sidebar

const LeftSidebar = () => {
  const { theme } = useTheme();
  const themeClasses = getThemeClasses(theme);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256); // Initial width (16rem = 256px)

  const chatHistory = [
    {
      id: 1,
      title: "Chat Group and Name Ideas",
      date: new Date(2024, 10, 25),
    },
    {
      id: 2,
      title: "Best AI Image",
      date: new Date(2024, 10, 24),
    },
    {
      id: 3,
      title: "AI Streamlit App Ideas",
      date: new Date(2024, 10, 23),
    },
    {
      id: 4,
      title: "Wimbledon 2024 Men's Final",
      date: new Date(2024, 10, 1),
    },
    {
      id: 5,
      title: "Language Classification Request",
      date: new Date(2024, 9, 15),
    },
  ];

  // Handle mouse move event for resizing
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = event.clientX;
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

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const recentChats = chatHistory.filter((chat) => chat.date >= last7Days);
  const olderChats = chatHistory.filter(
    (chat) => chat.date < last7Days && chat.date >= last30Days
  );

  // Theme-based hover and text color classes
  const themeHoverClasses = {
    light: {
      hover: "hover:bg-gray-200",
      text: "text-black",
      hoverText: "hover:text-gray-700",
      sidebarText: "text-gray-700",
    },
    dark: {
      hover: "hover:bg-gray-900",
      text: "text-white",
      hoverText: "hover:text-gray-300",
      sidebarText: "text-gray-300",
    },
    ocean: {
      hover: "hover:bg-blue-900/50",
      text: "text-blue-100",
      hoverText: "hover:text-blue-200",
      sidebarText: "text-blue-200",
    },
    forest: {
      hover: "hover:bg-green-900/50",
      text: "text-green-100",
      hoverText: "hover:text-green-200",
      sidebarText: "text-green-200",
    },
    sunset: {
      hover: "hover:bg-orange-900/50",
      text: "text-orange-100",
      hoverText: "hover:text-orange-200",
      sidebarText: "text-orange-200",
    },
  };

  // Get current theme's hover and text classes
  const currentThemeClasses =
    themeHoverClasses[theme] || themeHoverClasses.dark;

  return (
    <>
      {/* Main sidebar */}
      <div
        className={`fixed left-0 top-0 min-h-screen ${themeClasses.background} p-4 ${currentThemeClasses.text} overflow-hidden`}
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="flex justify-between items-center mb-6">
          <Settings className={`w-6 h-6 ${currentThemeClasses.sidebarText}`} />
          <div className="flex gap-4">
            <Share2 className={`w-6 h-6 ${currentThemeClasses.sidebarText}`} />
          </div>
        </div>

        <nav className="space-y-4">
          <div
            className={`flex items-center gap-3 px-2 py-2 ${currentThemeClasses.hover} ${currentThemeClasses.hoverText} rounded cursor-pointer`}
          >
            <Grid className="w-6 h-6 flex-shrink-0" />
            <span className="text-sm">SuperNova</span>
          </div>

          <div
            className={`flex items-center gap-3 px-2 py-2 ${currentThemeClasses.hover} ${currentThemeClasses.hoverText} rounded cursor-pointer`}
          >
            <Grid className="w-6 h-6 flex-shrink-0" />
            <span className="text-sm">Explore SuperNova</span>
          </div>

          <div className="mt-6">
            <h3 className={`text-xs ${currentThemeClasses.sidebarText} mb-2`}>
              Previous 7 Days
            </h3>
            <div className="space-y-3">
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`px-2.5 py-2.5 text-sm ${currentThemeClasses.hover} ${currentThemeClasses.hoverText} rounded cursor-pointer`}
                >
                  {chat.title}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className={`text-xs ${currentThemeClasses.sidebarText} mb-2`}>
              Previous 30 Days
            </h3>
            <div className="space-y-3">
              {olderChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`px-2.5 py-2.5 text-sm ${currentThemeClasses.hover} ${currentThemeClasses.hoverText} rounded cursor-pointer`}
                >
                  {chat.title}
                </div>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Drag handle */}
      <div
        className={`fixed left-0 top-0 bottom-0 cursor-ew-resize
          ${isResizing ? "bg-gray-800" : "bg-gray-800"}
          transition-colors duration-200`}
        style={{
          left: `${sidebarWidth}px`,
          cursor: "ew-resize",
          width: "1px",
          backgroundColor: "rgb(31 41 55)",
        }}
        onMouseDown={() => setIsResizing(true)}
      />
    </>
  );
};

export default LeftSidebar;
