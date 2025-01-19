"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";

const Profile = ({ profileImage, session }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  const handleOpenMenu = () => {
    setOpenMenu((prev) => !prev);
  };

  const navigateToProfile = () => {
    if (session?.user?.id) {
      router.push(`/usuario/${session.user.id}`);
    }
    setOpenMenu(false);
  };

  const navigateToProfileHistory = () => {
    if (session?.user?.id) {
      router.push(`/usuario/${session.user.id}/historial`);
    }
    setOpenMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div onClick={handleOpenMenu} className="cursor-pointer">
        {profileImage ? (
          <Image
            className="h-8 w-8 rounded-full"
            src={profileImage}
            width={40}
            height={40}
            alt=""
          />
        ) : (
          <FaUser size={20} className="cursor-pointer" />
        )}
      </div>
      {openMenu && (
        <div
          ref={menuRef}
          className="absolute w-[150px] bg-white -right-4 top-10 rounded-md text-black shadow-lg border border-gray-200 px-4 py-2 z-50"
        >
          <ul className="flex flex-col gap-2">
            <li
              className="text-sm font-medium text-gray-700 hover:text-white hover:bg-[#760e0d] transition-all rounded-md px-2 py-1 cursor-pointer"
              onClick={navigateToProfile}
            >
              Profile
            </li>
            <li
              className="text-sm font-medium text-gray-700 hover:text-white hover:bg-[#760e0d] transition-all rounded-md px-2 py-1 cursor-pointer"
              onClick={navigateToProfileHistory}
            >
              Historial
            </li>
            <li className="text-sm font-medium text-gray-700 hover:text-white hover:bg-[#760e0d] transition-all rounded-md px-2 py-1 cursor-pointer">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left"
              >
                Salir
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
