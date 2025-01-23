"use client";
import "@/assets/style/global.css";
import { useEffect, useState } from "react";
import AuthModal from "@/components/admin/AuthModal";
import jwtDecode from "jwt-decode";

const AdminLayout = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [showModal, setShowModal] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const adminToken = localStorage.getItem("adminToken");
      setIsAuthenticated(!!adminToken);
      if (!adminToken) {
        try {
          // Decode the token and check its validity
          const decoded = jwtDecode(adminToken);
          const isExpired = decoded.exp * 1000 < Date.now(); // Token expiration check
          if (!isExpired) {
            setIsAuthenticated(true);
            // setShowModal(false);
          } else {
            localStorage.removeItem("adminToken");
          }
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("adminToken");
        }
      }
      setLoading(false); // Authentication check complete
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (token) => {
    localStorage.setItem("adminToken", token);
    setIsAuthenticated(true);
    // setShowModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <html lang="es">
        <body className="h-screen flex items-center justify-center bg-gray-50">
          <div className="text-gray-500 text-lg">Loading...</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="es">
      <body className="min-h-screen w-full bg-gray-50">
        {!isAuthenticated && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <AuthModal onClose={handleAuthSuccess} />
          </div>
        )}
        {isAuthenticated && (
          <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Admin Panel</h1>
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
