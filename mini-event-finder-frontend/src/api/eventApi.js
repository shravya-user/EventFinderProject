import axiosInstance from "./axiosInstance";

/**
 * ✅ Create a new event (Protected)
 */
export const createEvent = async (data) => {
  try {
    return await axiosInstance.post("/events", data);
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

/**
 * ✅ Get all events (Public or filtered)
 * Example: ?search=music&location=hyderabad
 */
export const getAllEvents = (query = "") => axiosInstance.get(`/events${query}`);

/**
 * ✅ Get single event by ID (Public)
 */
export const getEventById = (id) => axiosInstance.get(`/events/${id}`);

/**
 * ✅ Join an event (Protected)
 */
export const joinEvent = async (id) => {
  try {
    return await axiosInstance.post(`/events/${id}/join`);
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

/**
 * ✅ Update event (Protected)
 */
export const updateEvent = async (id, data) => {
  try {
    return await axiosInstance.put(`/events/${id}`, data);
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

/**
 * 🗑️ Delete event (Protected)
 */export const deleteEvent = async (id) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in first to delete an event.");
      window.location.href = "/login";
      return;
    }

    // Explicitly attach token to ensure backend authorization works
    const response = await axiosInstance.delete(`/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      alert("Event deleted successfully!");
    }

    return response;
  } catch (error) {
    // Handle forbidden or expired token
    if (error?.response?.status === 403) {
      alert("You are not authorized to delete this event. Only the creator can delete it.");
    } else if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      alert("Session expired. Please log in again.");
      window.location.href = "/login";
    } else {
      alert("Failed to delete the event. Please try again.");
    }

    throw error;
  }
};


/**
 * 🚨 Helper — handle unauthorized (token expired)
 */
function handleAuthError(error) {
  if (error?.response?.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
}
