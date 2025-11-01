import { useState, useEffect } from 'react';
import { getAllEvents } from '../api/eventApi';
import { Link } from 'react-router-dom';
import { getDistance } from 'geolib';
import { motion } from 'framer-motion';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () => console.log('Location access denied')
    );
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const query = `?search=${search}&location=${location}`;
      const res = await getAllEvents(query);
      setEvents(res.data.data);
    } catch {
      setError('⚠️ Failed to load events. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-100 p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        ✨ Explore Amazing Events
      </h1>

      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-3 mb-8 max-w-3xl mx-auto"
      >
        <input
          type="text"
          placeholder="🔍 Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="text"
          placeholder="📍 Filter by location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:opacity-90 transition-all"
        >
          Filter
        </button>
      </form>

      {loading && <p className="text-center text-gray-400">Loading events...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {events.map((event, i) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-800/70 border border-gray-700 rounded-xl p-5 shadow-lg hover:shadow-blue-500/20 backdrop-blur-sm transition-all"
          >
            <h3 className="text-2xl font-semibold text-blue-400 mb-1">
              {event.title}
            </h3>
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
              {event.description}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              📍 {event.location} | 📅 {new Date(event.date).toLocaleDateString()}
            </p>
            {userLocation && event.latitude && event.longitude && (
              <p className="text-xs text-gray-500 mb-3">
                📏 {Math.round(getDistance(userLocation, { latitude: event.latitude, longitude: event.longitude }) / 1000)} km away
              </p>
            )}
            <div className="flex justify-between mt-4 text-sm font-medium">
              <Link
                to={`/events/${event._id}`}
                className="text-blue-400 hover:underline"
              >
                View Details
              </Link>
              <Link
                to={`/events/edit/${event._id}`}
                className="text-yellow-400 hover:underline"
              >
                Edit
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
