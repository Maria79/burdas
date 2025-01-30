"use client";

import { useBasket } from "@/context/BasketContext";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import Profile from "./Profile";
import Basket from "./Basket";
import { signIn, useSession, getProviders } from "next-auth/react";
import Image from "next/image";

const MENU_ITEMS = [
  { name: "Entrantes", path: "/menu/entrantes" },
  { name: "Perritos Calientes", path: "/menu/perritos-calientes" },
  { name: "Hamburguesas", path: "/menu/hamburguesas" },
  { name: "Enrollados", path: "/menu/enrollados" },
  { name: "Pepitos", path: "/menu/pepitos" },
  { name: "Bocadillos", path: "/menu/bocadillos" },
  { name: "Platos", path: "/menu/platos" },
  { name: "Postre", path: "/menu/postre" },
  { name: "Bebidas", path: "/menu/bebidas" },
];

const Navbar = ({ dishes, logo }) => {
  const { data: session } = useSession();
  const profileImage = session?.user.image;

  const [openMenu, setOpenMenu] = useState(false);
  const [providers, setProviders] = useState(null);
  const { basket, clearBasket } = useBasket();
  const menuRef = useRef(null);

  // Fetch authentication providers
  useEffect(() => {
    const setAuthProviders = async () => setProviders(await getProviders());
    setAuthProviders();
  }, []);

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

  const totalCount = basket.reduce((sum, item) => sum + item.count, 0);

  return (
    <>
      {/* Mobile menu */}
      <div className="w-full lg:hidden">
        <Image src={logo} alt="" width={250} height={200} sizes="100vw" />

        <div className=" w-full flex items-center justify-between relative">
          {/* Menu Icon */}
          <FaBars
            size={28}
            onClick={() => setOpenMenu((prev) => !prev)}
            className="cursor-pointer text-white hover:text-gray-300 transition-all"
          />

          {/* Mobile Dropdown */}
          {openMenu && (
            <div
              ref={menuRef}
              className="absolute top-[60px] left-0 w-full bg-white px-6 py-6 text-gray-800 shadow-lg border-t border-gray-200 z-50"
            >
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {MENU_ITEMS.map(({ name, path }) => (
                  <li key={path} className="text-center">
                    <Link
                      className="block font-medium text-sm text-gray-700 hover:text-white hover:bg-[#760e0d] rounded-md px-4 py-2 transition-all"
                      href={path}
                      onClick={() => setOpenMenu(false)}
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Profile and Basket */}
          <div className="flex items-center space-x-6">
            {session ? (
              <>
                <div className="relative">
                  <Basket dishes={dishes} resetCounts={clearBasket} />
                  {basket.length > 0 && (
                    <div className="absolute -top-2 -right-2 bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      {basket.reduce((sum, item) => sum + item.count, 0)}
                    </div>
                  )}
                </div>
                <Profile profileImage={profileImage} session={session} />
              </>
            ) : (
              providers &&
              Object.values(providers).map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => signIn(provider.id)}
                  className="bg-white text-black px-8 py-2 shadow-md hover:bg-[#760e0d] hover:text-white rounded-lg transition-all"
                >
                  Entrar
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Desktop menu */}
      <nav className="hidden lg:flex w-full justify-between items-center py-4">
        <Image src={logo} alt="" width={250} height={200} sizes="100vw" />
        <ul className="flex mx-auto space-x-6">
          {MENU_ITEMS.map(({ name, path }) => (
            <li key={path}>
              <Link
                className="text-white font-medium text-sm hover:text-gray-300 transition-all"
                href={path}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center space-x-6">
          {session ? (
            <>
              <div className="relative">
                <Basket dishes={dishes} resetCounts={clearBasket} />
                {basket.length > 0 && (
                  <div className="absolute -top-2 -right-2 bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {basket.reduce((sum, item) => sum + item.count, 0)}
                  </div>
                )}
              </div>
              <Profile profileImage={profileImage} session={session} />
            </>
          ) : (
            providers &&
            Object.values(providers).map((provider) => (
              <button
                key={provider.id}
                onClick={() => signIn(provider.id)}
                className="bg-white text-black px-8 py-2 shadow-md hover:bg-[#760e0d] hover:text-white rounded-lg transition-all"
              >
                Entrar
              </button>
            ))
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
