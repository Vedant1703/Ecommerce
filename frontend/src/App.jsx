import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Login from "./pages/Login"; // Unified login page
import Signup from "./pages/Signup.jsx";

// Optional: fallback 404 page
const NotFound = () => (
  <div className="flex justify-center items-center h-screen text-2xl font-bold text-red-500">
    404 - Page Not Found
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Single Login Page */}
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
