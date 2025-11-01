import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, deleteEvent, joinEvent } from "../api/eventApi";
import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch event + user
  useEffect(() => {
    (async () => {
      try {
        const res = await getEventById(id);
        setEvent(res.data.data);

        // fetch current logged-in user if token exists
        const token = localStorage.getItem("token");
        if (token) {
          const userRes = await axiosInstance.get("/auth/me");
          setUser(userRes.data.data || userRes.data);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteEvent(id);
      alert("Event deleted successfully!");
      navigate("/");
    } catch (error) {
      alert("❌ Failed to delete event");
      console.error(error);
    }
  };

  const handleJoin = async () => {
    try {
      await joinEvent(id);
      alert("🎉 You have successfully joined this event!");
      window.location.reload();
    } catch (error) {
      console.error("Join failed:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-300 mt-20">Loading event...</p>;
  if (!event) return <p className="text-center text-red-400 mt-20">Event not found.</p>;

  const isCreator = user && event.creator?._id === user._id;
  const alreadyJoined =
    user && event.participants?.some((p) => p._id === user._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-100 p-6"
    >
      <div className="w-full max-w-2xl bg-gray-800/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {event.title}
        </h2>

        <p className="text-gray-300 mb-3">{event.description}</p>
        <p className="text-sm text-gray-400 mb-2">📍 {event.location}</p>
        <p className="text-sm text-gray-400 mb-2">📅 {new Date(event.date).toLocaleDateString()}</p>
        <p className="text-sm text-gray-400 mb-2">
          👥 {event.currentParticipants}/{event.maxParticipants} participants
        </p>
        <p className="text-sm text-gray-400 mb-4">
          👤 Hosted by: {event.creator?.name || "Unknown"}
        </p>

        <div className="flex gap-3 mt-4">
          {/* Only show edit/delete if creator */}
          
         
          {/* Show joined message */}
          {/* Join / Joined / Creator Controls */}
<div className="flex flex-wrap items-center gap-3 mt-6">
  {/* Only show for creators */}
  {isCreator && (
    <>
      <button
        onClick={() => navigate(`/events/edit/${event._id}`)}
        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition shadow-md"
      >
        ✏️ Edit Event
      </button>
      <button
        onClick={handleDelete}
        className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition shadow-md"
      >
        🗑️ Delete Event
      </button>
    </>
  )}

  {/* Join button (non-creators only) */}
  {!isCreator && user && !alreadyJoined && (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleJoin}
      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white font-semibold shadow-lg hover:opacity-90 transition-all"
    >
      🤝 Join Event
    </motion.button>
  )}

  {/* Joined message */}
  {!isCreator && alreadyJoined && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="px-6 py-3 rounded-lg bg-gray-800 border border-green-500/50 text-green-400 font-semibold shadow-inner"
    >
      ✅ You’ve joined this event!
    </motion.div>
  )}

  {/* Not logged in? Show hint */}
  {!user && (
    <div className="mt-3 text-gray-400 text-sm">
      🔐 Please{" "}
      <button
        onClick={() => navigate("/login")}
        className="text-blue-400 hover:underline"
      >
        login
      </button>{" "}
      to join this event.
    </div>
  )}
</div>

        </div>
      </div>
    </motion.div>
  );
}
