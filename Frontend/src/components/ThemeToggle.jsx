import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
    );

    useEffect(() => {
        const element = document.documentElement;
        if (theme === "dark") {
            element.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            element.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle text-[var(--accent-primary)] hover:bg-[var(--card-bg)] duration-300"
            title="Toggle Theme"
        >
            {theme === "light" ? (
                <FaMoon className="text-xl" />
            ) : (
                <FaSun className="text-xl" />
            )}
        </button>
    );
};

export default ThemeToggle;
