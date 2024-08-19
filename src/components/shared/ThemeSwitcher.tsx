"use client";

import { useTheme } from "../../lib/hooks/useTheme";

const ThemeSwitcher: React.FC = () => {
  const [theme, toggleTheme] = useTheme();

  return (
    <button onClick={toggleTheme} className="p-2">
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
};

export default ThemeSwitcher;
