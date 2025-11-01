import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";

export default function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 🌙 Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 👤 Fetch user if token exists
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setUser(null);
    try {
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data?.data || res.data?.user || null);
    } catch {
      setUser(null);
      localStorage.removeItem("token");
    }
  };

  // 🔁 Recheck user every time location changes (after login/signup)
  useEffect(() => {
    fetchUser();
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-3"
          >
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                E
              </div>
              <span className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                Eventify
              </span>
            </Link>
          </motion.div>

          <div className="flex items-center gap-3">
            {user && (
              <Link
                to="/create"
                className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-sm hover:opacity-90 transition"
              >
                + Create
              </Link>
            )}

            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              className="p-2 rounded-full bg-gray-800/60 border border-gray-700 text-sm hover:scale-105 transition"
            >
              {theme === "dark" ? "🌞" : "🌙"}
            </button>

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-lg text-sm text-gray-200 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:opacity-95 transition"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-200 px-3 py-1 rounded-md bg-gray-800/50 border border-gray-700">
                  {user.name || "You"}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
      <div className="h-16" />
    </header>
  );
}
