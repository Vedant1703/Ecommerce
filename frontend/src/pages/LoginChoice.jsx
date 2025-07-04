
import { Link } from "react-router-dom";

const LoginChoice = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-6">
      <h2 className="text-3xl font-bold">Choose Login Type</h2>

      <div className="space-x-4">
        <Link to="/admin-login">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Admin Login
          </button>
        </Link>
        <Link to="/user-login">
          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
            User Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LoginChoice;
