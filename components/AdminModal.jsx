"use client";

import { useState } from "react";

const AdminModal = ({ isOpen, onClose }) => {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isCreatingAccount
        ? "/api/adminUsers"
        : "/api/adminLogin";
      const method = isCreatingAccount ? "POST" : "GET";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log(isCreatingAccount ? "Account created" : "Logged in");
        if (!isCreatingAccount) {
          onClose(); // Close modal on successful login
        }
      } else {
        const error = await response.json();
        console.error("Error:", error.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {isCreatingAccount ? "Create Account" : "Login"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-400"
            >
              {isCreatingAccount ? "Create Account" : "Login"}
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingAccount((prev) => !prev)}
              className="text-sm text-gray-500 underline"
            >
              {isCreatingAccount
                ? "Switch to Login"
                : "Switch to Create Account"}
            </button>
          </div>
        </form>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default AdminModal;
