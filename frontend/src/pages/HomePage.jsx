
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left: Image */}
      <div className="md:w-1/2 w-full">
        <img
          src="/assets/store.jpg" // replace with your own image in public/assets
          alt="store"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right: Content */}
      <div className="md:w-1/2 w-full flex flex-col justify-center items-center p-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to ShopSmart</h1>
        <p className="text-gray-600 max-w-md mb-6">
          🛒 Your one-stop solution for smart online shopping. Discover products, track orders, and manage your profile — all in one place.
        </p>

        <div className="space-y-4">
          <Link to="/choose-login">
            <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition">
              LOGIN
            </button>
          </Link>

          <button className="border border-purple-600 text-purple-600 px-6 py-2 rounded hover:bg-purple-50 transition">
            LOGIN AS GUEST
          </button>
        </div>

        <p className="mt-6 text-sm">
          Don’t have an account?{" "}
          <span className="text-purple-600 cursor-pointer hover:underline">Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Home;
