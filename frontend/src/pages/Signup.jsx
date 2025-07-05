import { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    role: "user",
    avatar: null,
    coverImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData();

  Object.keys(formData).forEach((key) => {
    if (formData[key]) {
      data.append(key, formData[key]);
    }
  });

  try {
    console.log(Object.fromEntries(data.entries()));

    const res = await axios.post(
  "http://localhost:8000/api/v1/users/register",
  data,
  {
    withCredentials: true,
  }
);



    if (res.data?.success) {
      alert("Signup successful!");
      console.log(res.data);
      // navigate("/login"); // optional
    } else {
      alert(res.data?.message || "Signup failed (from server)");
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert(error.response?.data?.message || "Signup failed (exception)");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <select
          name="role"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <label className="block">
          Avatar <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleChange}
          required
        />

        <label className="block">Cover Image (optional)</label>
        <input
          type="file"
          name="coverImage"
          accept="image/*"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 w-full rounded hover:bg-purple-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Signup;