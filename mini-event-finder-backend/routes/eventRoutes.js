const express = require('express');
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getEvents); // GET /api/events (with optional ?location=Mumbai)
router.get('/:id', getEventById); // GET /api/events/:id

// Protected routes (require authentication)
router.post('/', protect, createEvent); // POST /api/events
router.put('/:id', protect, updateEvent); // PUT /api/events/:id
router.delete('/:id', protect, deleteEvent); // DELETE /api/events/:id
router.post('/:id/join', protect, joinEvent); // POST /api/events/:id/join

module.exports = router;