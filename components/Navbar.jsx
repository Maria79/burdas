"use client";

import { useBasket } from "@/context/BasketContext";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import Profile from "./Profile";
import Basket from "./Basket";
import { signIn, useSession, getProviders } from "next-auth/react";

const MENU_ITEMS = [
  { name: "Entrantes", path: "/menu/entrantes" },
  { name: "Perritos Calientes", path: "/menu/perritos-calientes" },
  { name: "Hamburguesas", path: "/menu/hamburguesas" },
  { name: "Enrollados", path: "/menu/enrollados" },
  { name: "Pepitos", path: "/menu/pepitos" },
  { name: "Bocadillos", path: "/menu/bocadillos" },
  { name: "Platos", path: "/menu/platos" },
  // { name: "Postre", path: "/menu/postre" },
  // { name: "Bebidas", path: "/menu/bebidas" },
];

const Navbar = ({ dishes }) => {
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
      <div className="lg:hidden w-full flex items-center justify-between">
        <FaBars size={28} onClick={() => setOpenMenu((prev) => !prev)} />
        {openMenu && (
          <div
            ref={menuRef}
            className="absolute top-[185px] left-0 w-full bg-white px-6 py-8 text-gray-800 shadow-lg border-t border-gray-200 z-50"
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

        {session ? (
          <div className="relative flex items-center space-x-4">
            <Basket dishes={dishes} resetCounts={clearBasket} />
            {totalCount > 0 && (
              <div className="absolute -top-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-sm">
                {totalCount}
              </div>
            )}
            <Profile profileImage={profileImage} session={session} />
          </div>
        ) : (
          providers &&
          Object.values(providers).map((provider) => (
            <button
              key={provider.id}
              onClick={() => {
                signIn(provider.id);
              }}
              className="bg-white text-black px-8 py-2 shadow-md hover:bg-[#760e0d] hover:text-white rounded-xl"
            >
              Entrar
            </button>
          ))
        )}
      </div>

      {/* Desktop menu */}
      <nav className="hidden lg:flex w-full justify-between items-center">
        <ul className="flex mx-auto space-x-4">
          {MENU_ITEMS.map(({ name, path }) => (
            <li key={path}>
              <Link className="cursor-pointer" href={path}>
                {name}
              </Link>
            </li>
          ))}
        </ul>
        {session ? (
          <div className="relative flex items-center space-x-4">
            <Basket dishes={dishes} resetCounts={clearBasket} />
            {totalCount > 0 && (
              <div className="absolute -top-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-sm">
                {totalCount}
              </div>
            )}
            <Profile profileImage={profileImage} session={session} />
          </div>
        ) : (
          providers &&
          Object.values(providers).map((provider) => (
            <button
              key={provider.id}
              onClick={() => signIn(provider.id)}
              className="bg-white text-black px-8 py-2 shadow-md hover:bg-[#760e0d] hover:text-white rounded-xl"
            >
              Entrar
            </button>
          ))
        )}
      </nav>
    </>
  );
};

export default Navbar;
