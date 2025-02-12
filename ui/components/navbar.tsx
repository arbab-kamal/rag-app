import { ChevronDown } from "lucide-react";
import { getThemeClasses, ThemeChanger, useTheme } from "./Theme";
import { UserProfileButton } from "./Userbutton";

const Navbar = () => {
  const { theme } = useTheme();
  const themeClasses = getThemeClasses(theme);

  return (
    <header
      className={`flex flex-wrap justify-between items-center py-2 px-4 border-b border-gray-600 ${themeClasses.background}`}
    >
      {/* Logo and dropdown button */}
      <button
        className={`flex items-center gap-2 hover:opacity-75 ${themeClasses.text}`}
      >
        <span className="text-lg font-semibold">SuperNova</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Theme changer and user profile button */}
      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
        <ThemeChanger />
        <UserProfileButton />
      </div>
    </header>
  );
};

export default Navbar;
