"use client";

import { useState } from "react";
import AdminModal from "@/components/AdminModal";

const AdminPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Admin Login
      </button>
      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AdminPage;
