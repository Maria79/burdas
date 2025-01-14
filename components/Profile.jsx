"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaUser } from "react-icons/fa";

const Profile = ({ profileImage, session }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const router = useRouter();

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
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
  return (
    <>
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
      </div>
      {openMenu && (
        <div className="absolute w-[130px] bg-white -right-4 top-10 rounded-md text-black border border-[#760e0d] px-2 py-4">
          <ul>
            <li
              className="text-nowrap mb-1 hover:shadow-md cursor-pointer"
              onClick={navigateToProfile}
            >
              Profile
            </li>
            <li
              className="text-nowrap mb-1 hover:shadow-md cursor-pointer"
              onClick={navigateToProfileHistory}
            >
              Historial
            </li>
            <li className="text-nowrap mb-1 hover:shadow-md cursor-pointer">
              <button onClick={() => signOut({ callbackUrl: "/" })}>
                Salir
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Profile;
