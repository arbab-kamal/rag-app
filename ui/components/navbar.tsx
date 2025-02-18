import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { getThemeClasses, ThemeChanger, useTheme } from "./Theme";
import { UserProfileButton } from "./Userbutton";

const Navbar = () => {
  const { theme } = useTheme();
  const themeClasses = getThemeClasses(theme);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Theme-specific dropdown style classes
  const dropdownClasses = {
    light: {
      background: "bg-white",
      text: "text-gray-800",
      hover: "hover:bg-gray-100",
      border: "border border-gray-200",
    },
    dark: {
      background: "bg-gray-900",
      text: "text-gray-100",
      hover: "hover:bg-gray-800",
      border: "border border-gray-700",
    },
    ocean: {
      background: "bg-blue-950",
      text: "text-blue-100",
      hover: "hover:bg-blue-900",
      border: "border border-blue-800",
    },
    forest: {
      background: "bg-green-950",
      text: "text-green-100",
      hover: "hover:bg-green-900",
      border: "border border-green-800",
    },
    sunset: {
      background: "bg-orange-950",
      text: "text-orange-100",
      hover: "hover:bg-orange-900",
      border: "border border-orange-800",
    },
  };

  // Get current theme's dropdown classes
  const currentDropdownClasses = dropdownClasses[theme] || dropdownClasses.dark;

  return (
    <header
      className={`flex flex-wrap justify-between items-center py-2 px-4 border-b border-gray-600 ${themeClasses.background}`}
    >
      {/* Logo and dropdown button */}
      <div className="relative" ref={dropdownRef}>
        <button
          className={`flex items-center gap-2 hover:opacity-75 ${themeClasses.text}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="text-lg font-semibold">SuperNova</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* Language dropdown menu */}
        {isDropdownOpen && (
          <div
            className={`absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg z-10 ${currentDropdownClasses.background} ${currentDropdownClasses.border}`}
          >
            <div className="py-1">
              <div
                className={`flex items-center gap-2 px-4 py-2 ${currentDropdownClasses.text} text-sm ${currentDropdownClasses.hover} cursor-pointer`}
              >
                <Globe className="w-4 h-4" />
                <span>English</span>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 ${currentDropdownClasses.text} text-sm ${currentDropdownClasses.hover} cursor-pointer`}
              >
                <Globe className="w-4 h-4" />
                <span>العربية (Arabic)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Theme changer and user profile button */}
      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
        <ThemeChanger />
        <UserProfileButton />
      </div>
    </header>
  );
};

export default Navbar;
