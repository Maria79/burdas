"use client";

import { useBasket } from "@/context/BasketContext";
import { useState, useEffect, useRef } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IoRemoveCircleOutline } from "react-icons/io5";

const extrasList = [
  { name: "Queso Asado", price: 2.0 },
  { name: "Queso Cheddar", price: 1.2 },
  { name: "Aguacate", price: 1.5 },
  { name: "Plátano Frito", price: 1.5 },
  { name: "Bacón", price: 1.2 },
  { name: "Pollo Crispy", price: 2.0 },
  { name: "Ensalada de Col Dulce", price: 1.6 },
  { name: "Postres", price: 1.6 },
];

const Basket = () => {
  const [openBasket, setOpenBasket] = useState(false);
  const [openExtras, setOpenExtras] = useState({});
  const { basket, removeFromBasket, addExtrasToItem } = useBasket();
  const router = useRouter();
  const { data: session } = useSession();
  const basketRef = useRef(null);

  const toggleBasket = () => setOpenBasket((prev) => !prev);

  const toggleExtras = (itemId) => {
    setOpenExtras((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));

    // Scroll the selected item into view within the basket container
    const itemRef = document.getElementById(`basket-item-${itemId}`);
    if (itemRef) {
      itemRef.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  };

  const handleAction = (action) => {
    if (action === "cancel") setOpenBasket(false);
    if (action === "pay") router.push(`/usuario/${session.user.id}/pagar`);
    setOpenBasket(false);
  };

  // const handleRemoveItem = (id) => {
  //   removeFromBasket(id); // Use the context function directly
  // };

  const handleExtraChange = (itemId, extra) => {
    const currentExtras =
      basket.find((item) => item._id === itemId)?.extras || [];
    const updatedExtras = currentExtras.includes(extra.name)
      ? currentExtras.filter((e) => e !== extra.name) // Remove extra
      : [...currentExtras, extra.name]; // Add extra

    // Update the basket context with the new extras
    addExtrasToItem(itemId, updatedExtras);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);

  const totalAmount = basket.reduce((total, item) => {
    const extrasPrice = (item.extras || []).reduce((sum, extraName) => {
      const extra = extrasList.find((e) => e.name === extraName);
      return sum + (extra ? extra.price : 0);
    }, 0);
    return (
      total +
      item.count * Number(item.price?.replace(",", ".") || 0) +
      extrasPrice
    );
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
          ref={basketRef}
          className="absolute w-[360px] md:w-[460px] -right-16 md:-right-6 top-[40px] px-4 py-6 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-lg z-50"
        >
          <h2 className="text-lg font-bold text-[#760e0d] border-b border-gray-200 pb-2 mb-4">
            Tu pedido
          </h2>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {basket.map(({ _id, type, name, count, price, extras }) => (
              <div
                key={_id}
                id={`basket-item-${_id}`}
                className="flex flex-col bg-gray-50 p-2 rounded-md shadow-sm"
              >
                <div className="flex justify-between items-center">
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
                      {formatPrice(
                        count * Number(price?.replace(",", ".") || 0) +
                          (extras?.reduce((sum, extraName) => {
                            const extra = extrasList.find(
                              (e) => e.name === extraName
                            );
                            return sum + (extra ? extra.price : 0);
                          }, 0) || 0)
                      )}
                    </span>
                    <IoRemoveCircleOutline
                      size={24}
                      className="text-red-500 hover:text-red-600 cursor-pointer transition duration-200"
                      onClick={() => removeFromBasket(_id)}
                    />
                  </div>
                </div>
                {extras && extras.length > 0 && (
                  <div className="mt-2 pl-4 text-sm text-gray-600">
                    <p className="font-light text-gray-700">
                      Extras:{" "}
                      <span>
                        {extras.map((extraName, index) => {
                          const extra = extrasList.find(
                            (e) => e.name === extraName
                          );
                          return (
                            <span key={index} className="italic">
                              {extra.name}
                              {index < extras.length - 1 && ", "}
                            </span>
                          );
                        })}
                      </span>
                    </p>
                  </div>
                )}
                <div className="mt-3">
                  <button
                    onClick={() => toggleExtras(_id)}
                    className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm transition duration-200 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Extras
                  </button>
                  {openExtras[_id] && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {extrasList.map((extra) => (
                        <label
                          key={extra.name}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={extras?.includes(extra.name) || false}
                            onChange={() => handleExtraChange(_id, extra)}
                          />
                          <span className="text-sm text-gray-700">
                            {extra.name} ({formatPrice(extra.price)})
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
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
