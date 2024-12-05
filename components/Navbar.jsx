"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };
  return (
    <>
      <div className="sm:hidden w-full">
        <FaBars size={28} className="text-center" onClick={handleOpenMenu} />
        {openMenu && (
          <div className="top-[180px] left-0 absolute w-full bg-[#b3b0b0] text-black px-4 py-6">
            <ul>
              <ul className="grid grid-cols-3 gap-2">
                <li>Entrantes</li>
                <li>Perritos Calientes</li>
                <li>Hamburquesas</li>
                <li>Enrollados</li>
                <li>Pepitos</li>
                <li>Bocadillos</li>
                <li>Platos</li>
                <li>Postre</li>
                <li>Bebidas</li>
              </ul>
            </ul>
          </div>
        )}
      </div>

      <nav className="hidden sm:block">
        <ul className="flex space-x-2">
          <li>Entrantes</li>
          <li>Perritos Calientes</li>
          <li>Hamburquesas</li>
          <li>Enrollados</li>
          <li>Pepitos</li>
          <li>Bocadillos</li>
          <li>Platos</li>
          <li>Postre</li>
          <li>Bebidas</li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
