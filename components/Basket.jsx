"use client";

import { useBasket } from "@/context/BasketContext";
import { useState, useEffect, useRef } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IoRemoveCircleOutline } from "react-icons/io5";

const Basket = () => {
  const [openBasket, setOpenBasket] = useState(false);
  const { basket, clearBasket, removeFromBasket } = useBasket();
  const router = useRouter();
  const { data: session } = useSession();
  const basketRef = useRef(null);

  const toggleBasket = () => setOpenBasket((prev) => !prev);

  const handleAction = (action) => {
    if (action === "cancel") setOpenBasket(false);
    if (action === "pay") router.push(`/usuario/${session.user.id}/pagar`);
    setOpenBasket(false);
  };

  const handleRemoveItem = (id) => {
    removeFromBasket(id); // Use the context function directly
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);

  const totalAmount = basket.reduce((total, item) => {
    const itemTotal = item.count * Number(item.price?.replace(",", ".") || 0);
    return total + itemTotal;
  }, 0);

  // Close the basket when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (basketRef.current && !basketRef.current.contains(event.target)) {
        setOpenBasket(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="">
        <FaShoppingBasket
          onClick={toggleBasket}
          size={28}
          className="cursor-pointer"
        />
      </div>
      {openBasket && basket.length !== 0 && (
        <div
          ref={basketRef} // Attach the ref to the basket container
          className="absolute w-[360px] md:w-[460px] -right-16 md:-right-6 top-[40px] px-4 py-6 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-lg z-50"
        >
          <h2 className="text-lg font-bold text-[#760e0d] border-b border-gray-200 pb-2 mb-4">
            Tu pedido
          </h2>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {basket.map(({ _id, type, name, count, price }) => (
              <div
                key={_id}
                className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded-md shadow-sm"
              >
                <div className="flex-1 truncate">
                  - <span className="capitalize text-gray-700">{type}</span> _{" "}
                  <span className="capitalize font-semibold text-gray-900">
                    {name}
                  </span>{" "}
                  {count > 1 && (
                    <span className="text-gray-500 text-sm">x{count}</span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-700">
                    {formatPrice(count * Number(price?.replace(",", ".") || 0))}
                  </span>
                  <IoRemoveCircleOutline
                    size={24}
                    className="text-red-500 hover:text-red-600 cursor-pointer transition duration-200"
                    onClick={() => handleRemoveItem(_id)}
                  />
                </div>
              </div>
            ))}
          </div>
          <hr className="border-gray-200 my-4" />
          <div className="flex justify-between items-center px-2">
            <span className="text-lg font-bold text-gray-900">Total:</span>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(totalAmount)}
            </span>
          </div>
          <div className="flex justify-between space-x-4 mt-6">
            <button
              onClick={() => handleAction("cancel")}
              className="w-full py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition duration-200"
            >
              Cerrar
            </button>
            <button
              onClick={() => handleAction("pay")}
              className="w-full py-2 text-sm font-medium text-white bg-[#93e0a4] rounded-md hover:bg-[#76c18a] transition duration-200"
            >
              Pagar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Basket;
