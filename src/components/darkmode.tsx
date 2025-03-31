import { useState, useEffect } from "react";
import { Moon } from "lucide-react";
import { Lightbulb } from "lucide-react";

export function ModeToggle() {
  const getSavedTheme = (): "dark" | "light" => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === null || savedTheme === undefined) {
      localStorage.setItem("theme", "light");
      return "light";
    }
    return savedTheme as "dark" | "light";
  };

  const [theme, setTheme] = useState<"dark" | "light">(getSavedTheme);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div onClick={toggleTheme} className="cursor-pointer ">
      <Moon
        style={{
          display: theme === "dark" ? "none" : "block",
          width: 20,
          height: 20,
        }}
      />
      <Lightbulb
        style={{
          display: theme === "dark" ? "block" : "none",
          width: 20,
          height: 20,
        }}
      />
    </div>
  );
}
