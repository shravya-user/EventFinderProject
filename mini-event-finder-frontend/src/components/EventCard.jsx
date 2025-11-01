import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card-glass p-5"
    >
      <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
      <p className="text-gray-400 text-sm mb-3">{event.description}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>📍 {event.location}</span>
        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
      </div>

      <div className="mt-4 flex justify-between">
        <Link
          to={`/events/${event._id}`}
          className="btn-primary text-sm"
        >
          View Details
        </Link>
        <Link
          to={`/events/${event._id}/edit`}
          className="btn-secondary text-sm"
        >
          Edit
        </Link>
      </div>
    </motion.div>
  );
}
