"use client";

import { useState } from "react";

const AuthModal = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const endpoint = isRegister ? "/api/admin/register" : "/api/admin/login";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Something went wrong");
      } else {
        alert(result.message);
        if (result.token) {
          onClose(result.token); // Pass the token to the parent component
        }
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      setError("Failed to process the request.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isRegister ? "Sign Up" : "Login"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}

        <form className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all"
          >
            {isRegister ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              {isRegister ? "Login" : "Sign Up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
