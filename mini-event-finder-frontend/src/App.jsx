import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import EventList from "./components/EventList";
import EventDetail from "./components/EventDetail";
import EventForm from "./components/EventForm";
import EditEventForm from "./components/EditEventForm";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <EventForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/edit/:id"
          element={
            <ProtectedRoute>
              <EditEventForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
