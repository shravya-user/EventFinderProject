const Event = require('../models/Event');

// @desc    Create new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const { title, description, location, date, maxParticipants } = req.body;

    // Validation
    if (!title || !description || !location || !date || !maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create event with creator as logged-in user
    const event = await Event.create({
      title,
      description,
      location,
      date,
      maxParticipants,
      creator: req.user._id,
      currentParticipants: 0,
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating event',
      error: error.message,
    });
  }
};

// @desc    Get all events (with optional location filter)
// @route   GET /api/events?location=Mumbai
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { location, search } = req.query;

    // Build query
    let query = {};

    // Filter by location if provided
    if (location) {
      query.location = { $regex: location, $options: 'i' }; // Case-insensitive search
    }

    // Search in title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query)
      .populate('creator', 'name email')
      .sort({ date: 1 }); // Sort by date ascending

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events',
      error: error.message,
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creator', 'name email location')
      .populate('participants', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    
    // Handle invalid MongoDB ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching event',
      error: error.message,
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (only creator)
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is the creator
    if (event.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    // Update event
    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating event',
      error: error.message,
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (only creator)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is the creator
    if (event.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting event',
      error: error.message,
    });
  }
};

// @desc    Join an event (add participant)
// @route   POST /api/events/:id/join
// @access  Private
const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if event is full
    if (event.isFull()) {
      return res.status(400).json({
        success: false,
        message: 'Event is full',
      });
    }

    // Check if user already joined
    if (event.participants.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already joined this event',
      });
    }

    // Add user to participants
    event.participants.push(req.user._id);
    event.currentParticipants += 1;

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Successfully joined the event',
      data: event,
    });
  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while joining event',
      error: error.message,
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
};