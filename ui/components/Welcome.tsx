"use client";
import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { getThemeClasses, useTheme } from "./Theme";

interface WelcomeUserProps {
  className?: string;
}

const WelcomeUser: React.FC<WelcomeUserProps> = ({ className = "" }) => {
  const { theme } = useTheme();
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const themeClasses = getThemeClasses(theme);

  const themeSpecificClasses = {
    light: {
      text: "text-gray-800",
      subtext: "text-gray-600",
      icon: "text-gray-700",
    },
    dark: {
      text: "text-white",
      subtext: "text-gray-300",
      icon: "text-gray-200",
    },
    ocean: {
      text: "text-blue-100",
      subtext: "text-blue-200",
      icon: "text-blue-300",
    },
    forest: {
      text: "text-green-100",
      subtext: "text-green-200",
      icon: "text-green-300",
    },
    sunset: {
      text: "text-orange-100",
      subtext: "text-orange-200",
      icon: "text-orange-300",
    },
  };

  const currentThemeClasses =
    themeSpecificClasses[theme] || themeSpecificClasses.dark;

  useEffect(() => {
    fetchUsername();
  }, []);

  const fetchUsername = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/userName", {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          // User not logged in, this is expected
          setUsername("");
        } else {
          throw new Error(`Failed to fetch username: ${response.statusText}`);
        }
      } else {
        const data = await response.text();
        setUsername(data);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error fetching username";
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`p-4 rounded-lg ${themeClasses.secondaryBackground} ${className}`}
      >
        <p className={`text-sm ${currentThemeClasses.subtext}`}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-4 rounded-lg ${themeClasses.secondaryBackground} ${className}`}
      >
        <p className="text-sm text-red-400">
          Something went wrong. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-lg ${themeClasses.secondaryBackground} ${className}`}
    >
      {username ? (
        <div className="flex items-center gap-3">
          <User className={`w-6 h-6 ${currentThemeClasses.icon}`} />
          <div>
            <h2 className={`text-lg font-semibold ${currentThemeClasses.text}`}>
              Welcome back, {username}!
            </h2>
            <p className={`text-sm ${currentThemeClasses.subtext}`}>
              We're glad to see you again.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <User className={`w-6 h-6 ${currentThemeClasses.icon}`} />
          <div>
            <h2 className={`text-lg font-semibold ${currentThemeClasses.text}`}>
              Welcome, Guest!
            </h2>
            <p className={`text-sm ${currentThemeClasses.subtext}`}>
              Please log in to access all features.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeUser;
