"use client";
import "@/assets/style/global.css";
import { useEffect, useState } from "react";
import AuthModal from "@/components/admin/AuthModal";
import { jwtDecode } from "jwt-decode";

const AdminLayout = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const adminToken = localStorage.getItem("adminToken");

      if (adminToken) {
        try {
          const decoded = jwtDecode(adminToken);
          const isExpired = decoded.exp * 1000 < Date.now();
          if (!isExpired) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("adminToken");
          }
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("adminToken");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (token) => {
    localStorage.setItem("adminToken", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  return (
    <html lang="es">
      <body className="min-h-screen w-full bg-gray-50">
        {loading ? (
          <div className="h-screen flex items-center justify-center bg-gray-50">
            <div className="text-gray-500 text-lg">Loading...</div>
          </div>
        ) : !isAuthenticated ? (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <AuthModal onClose={handleAuthSuccess} />
          </div>
        ) : (
          <div className="max-w-full px-0 md:px-6 py-10">
            <div className="flex justify-between items-center mb-12 px-4">
              <h1 className="text-2xl font-bold"></h1>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
            {children}
          </div>
        )}
      </body>
    </html>
  );
};

export default AdminLayout;
