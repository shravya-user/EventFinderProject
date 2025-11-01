import { useState } from 'react';
import { createEvent } from '../api/eventApi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function EventForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    maxParticipants: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createEvent(formData);
      alert('✅ Event created successfully!');
      navigate('/');
    } catch {
      setError('❌ Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800/80 border border-gray-700 text-gray-100 rounded-2xl shadow-xl p-8 w-full max-w-md backdrop-blur-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          ✨ Create New Event
        </h2>

        {error && (
          <p className="text-red-400 text-center mb-3">{error}</p>
        )}

        {Object.keys(formData).map((key) => (
          <div key={key} className="mb-4">
            <label className="block mb-1 capitalize text-sm text-gray-400">
              {key}
            </label>
            <input
              type={
                key === 'date'
                  ? 'date'
                  : key === 'maxParticipants'
                  ? 'number'
                  : 'text'
              }
              placeholder={key}
              value={formData[key]}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.value })
              }
              className="w-full p-3 bg-gray-900/70 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-100"
            />
          </div>
        ))}

        <button
          disabled={loading}
          className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-purple-600 font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </motion.div>
  );
}
