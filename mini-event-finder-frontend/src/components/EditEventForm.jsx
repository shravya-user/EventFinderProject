import { useEffect, useState } from "react";
import { getEventById, updateEvent } from "../api/eventApi";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function EditEventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    maxParticipants: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getEventById(id);
        setFormData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch event:", err);
        alert("⚠️ Failed to load event details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEvent(id, formData);
      alert("🎉 Event updated successfully!");
      navigate(`/events/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Update failed. Please log in again or try later.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-300">
        Loading event details...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-100 p-6"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-gray-800/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 shadow-lg hover:shadow-purple-500/20 transition-all"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          ✏️ Edit Event
        </h2>

        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-semibold mb-2 capitalize text-gray-300">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={
                key === "date"
                  ? "date"
                  : key === "maxParticipants"
                  ? "number"
                  : "text"
              }
              value={value || ""}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.value })
              }
              className="w-full p-3 bg-gray-900/70 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-100 placeholder-gray-500"
            />
          </div>
        ))}

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:opacity-90 shadow-md transition-all"
          >
            💾 Update Event
          </button>
        </div>
      </form>
    </motion.div>
  );
}
