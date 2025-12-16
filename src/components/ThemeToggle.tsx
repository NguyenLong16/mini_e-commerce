import { set } from "date-fns"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState<boolean>(false)
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDark(true)
            document.documentElement.classList.add('dark')
        } else {
            setIsDark(false)
            document.documentElement.classList.remove('dark')
        }
    }, [])

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDark(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDark(true);
        }
    };

    return (
        <>
            <button
                onClick={toggleTheme}
                className="p-3 rounede-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300
                dark:hover:bg-gray-600 transition-all duration-300 shadow-md"
                aria-label="Toggle dark mode"
            >
                {isDark ? (
                    <Moon className="w-5 h-5 text-yellow-400" />
                ) : (
                    <Sun className="w-5 h-5 text-orange-500" />
                )}
            </button>
        </>
    )

}

export default ThemeToggle