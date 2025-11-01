import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🚫 Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axiosInstance.post("/auth/signup", form);
      localStorage.setItem("token", res.data.data.token);
      alert(`Welcome, ${res.data.data.name}!`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
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
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Create Your Account 🚀
        </h2>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full bg-gray-900/60 p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
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
            placeholder="Password(min 6 digits)"
            className="w-full bg-gray-900/60 p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Location (optional)"
            className="w-full bg-gray-900/60 p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:opacity-90 transition-all p-3 rounded-lg font-semibold text-white"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
