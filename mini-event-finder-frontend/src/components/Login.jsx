import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🚫 Redirect logged-in users
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axiosInstance.post("/auth/login", form);
      localStorage.setItem("token", res.data.data.token);
      alert(`Welcome back, ${res.data.data.name}!`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/70 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Welcome Back 👋
        </h2>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-gray-900/60 p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-gray-900/60 p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-all p-3 rounded-lg font-semibold text-white"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
