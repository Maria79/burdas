"use client";
import { useBasket } from "@/context/BasketContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import Profile from "./Profile";
import Basket from "./Basket";
import { signIn, useSession, getProviders } from "next-auth/react";

const Navbar = ({ dishes }) => {
  const { data: session } = useSession();
  const profileImage = session?.user.image;

  const [openMenu, setOpenMenu] = useState(false);
  const [providers, setProviders] = useState(null);
  const { basket, clearBasket } = useBasket();

  // Fetch authentication providers
  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProviders();
  }, []);

  // Total item count in the basket
  const totalCount = basket.reduce((sum, item) => sum + item.count, 0);

  // Mobile menu toggle
  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  // Function to reset counts and clear the basket
  const resetCounts = () => {
    clearBasket(); // Clear the basket
  };

  return (
    <>
      {/* Mobile menu */}
      <div className="lg:hidden w-full flex items-center justify-between">
        <FaBars size={28} className="text-center" onClick={handleOpenMenu} />
        {openMenu && (
          <div className="top-[180px] left-0 absolute w-full bg-[#b3b0b0] text-black px-4 py-6">
            <ul>
              <ul className="grid grid-cols-3 gap-2">
                <li>
                  <Link className="cursor-pointer" href="/menu/entrantes">
                    Entrantes
                  </Link>
                </li>
                <li>
                  <Link
                    className="cursor-pointer"
                    href="/menu/perritos-calientes"
                  >
                    Perritos Calientes
                  </Link>
                </li>
                <li>
                  <Link className="cursor-pointer" href="/menu/hamburguesas">
                    Hamburguesas
                  </Link>
                </li>
                <li>
                  <Link className="cursor-pointer" href="/menu/enrollados">
                    Enrollados
                  </Link>
                </li>
                <li>
                  <Link className="cursor-pointer" href="/menu/pepitos">
                    Pepitos
                  </Link>
                </li>
                <li>
                  <Link className="cursor-pointer" href="/menu/bocadillos">
                    Bocadillos
                  </Link>
                </li>
                <li>
                  <Link className="cursor-pointer" href="/menu/platos">
                    Platos
                  </Link>
                </li>
                <li>
                  <Link className="cursor-pointer" href="/menu/postre">
                    Postre
                  </Link>
                </li>
                <li>
                  <Link className="cursor-pointer" href="/menu/bebidas">
                    Bebidas
                  </Link>
                </li>
              </ul>
            </ul>
          </div>
        )}

        {session && (
          <div className="relative flex items-center space-x-4">
            <Basket dishes={dishes} resetCounts={resetCounts} />
            {totalCount > 0 && (
              <div className="absolute -top-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-sm">
                {totalCount}
              </div>
            )}
            <Profile profileImage={profileImage} />
          </div>
        )}
        {!session && (
          <div>
            {providers &&
              Object.values(providers).map((provider, index) => (
                <button
                  key={index}
                  onClick={() => signIn(provider.id)}
                  className="bg-white text-black px-8 py-4 shadow-md hover:bg-[#760e0d] hover:text-white hover:border hover:border-white rounded-xl"
                >
                  <span>Entrar</span>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Desktop menu */}
      <nav className="hidden lg:flex w-full justify-between items-center">
        <ul className="flex space-x-4 max-w-fit mx-auto">
          <li>
            <Link className="cursor-pointer" href="/menu/entrantes">
              Entrantes
            </Link>
          </li>
          <li>
            <Link className="cursor-pointer" href="/menu/perritos-calientes">
              Perritos Calientes
            </Link>
          </li>
          <li>
            <Link className="cursor-pointer" href="/menu/hamburguesas">
              Hamburguesas
            </Link>
          </li>
          <li>
            <Link className="cursor-pointer" href="/menu/enrollados">
              Enrollados
            </Link>
          </li>
          <li>
            <Link className="cursor-pointer" href="/menu/pepitos">
              Pepitos
            </Link>
          </li>
          <li>
            <Link className="cursor-pointer" href="/menu/bocadillos">
              Bocadillos
            </Link>
          </li>
          <li>
            <Link className="cursor-pointer" href="/menu/platos">
              Platos
            </Link>
          </li>
          <li>
            <Link className="cursor-pointer" href="/menu/postre">
              Postre
            </Link>
          </li>
          <li>
            <Link className="cursor-pointer" href="/menu/bebidas">
              Bebidas
            </Link>
          </li>
        </ul>
        {session && (
          <div className="self-end">
            <div className="relative flex items-center space-x-4">
              <Basket dishes={dishes} resetCounts={resetCounts} />
              {totalCount > 0 && (
                <div className="absolute -top-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-sm">
                  {totalCount}
                </div>
              )}

              <Profile profileImage={profileImage} />
            </div>
          </div>
        )}
        {!session && (
          <div>
            {providers &&
              Object.values(providers).map((provider, index) => (
                <button
                  key={index}
                  onClick={() => signIn(provider.id)}
                  className="bg-white text-black px-8 py-4 shadow-md hover:bg-[#760e0d] hover:text-white hover:border hover:border-white rounded-xl"
                >
                  <span>Entrar</span>
                </button>
              ))}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
